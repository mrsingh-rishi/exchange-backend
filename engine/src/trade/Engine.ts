import { Fill, Order, OrderBook } from "./OrderBook";
import fs from "fs";

// Base currency used in the trading engine
export const BASE_CURRENCY = "INR";

/**
 * Interface representing the structure of a user's balance
 */
interface UserBalance {
  [key: string]: {
    available: number;
    locked: number;
  };
}

/**
 * Class representing the core trading engine
 * 
 * Manages order books, user balances, and provides methods for order creation,
 * snapshot saving, and fund checking/locking.
 */
export class Engine {
  private orderbooks: OrderBook[] = [];
  private balances: Map<string, UserBalance> = new Map();

  constructor() {
    let snapshot = null;

    // Attempt to load a snapshot from a file if specified by an environment variable
    try {
      if (process.env.WITH_SNAPSHOT) {
        snapshot = fs.readFileSync("./snapshot.json");
      }
    } catch (error) {
      console.log("No snapshots found");
    }

    if (snapshot) {
      // If a snapshot is found, restore order books and balances from it
      const snapshotSnapshot = JSON.parse(snapshot.toString());
      this.orderbooks = snapshotSnapshot.orderbooks.map(
        (o: any) =>
          new OrderBook(
            o.baseAsset,
            o.bids,
            o.asks,
            o.lastTradeId,
            o.currentPrice
          )
      );
      this.balances = new Map(snapshotSnapshot.balances);
    } else {
      // If no snapshot is found, initialize with default order books and balances
      this.orderbooks.push(new OrderBook("TATA", [], [], 0, 1000));
      this.setBaseBalances();
    }

    // Periodically save snapshots every 3 seconds
    setInterval(() => {
      this.saveSnapshot();
    }, 1000 * 3);
  }

  /**
   * Saves the current state of order books and balances to a snapshot file.
   */
  saveSnapshot() {
    const snapshotSnapshot = {
      orderbooks: this.orderbooks.map((o) => o.getSnapshot()),
      balances: Array.from(this.balances.entries()),
    };

    fs.writeFileSync("./snapshot.json", JSON.stringify(snapshotSnapshot));
  }

  /**
   * Adds a new order book to the engine.
   * 
   * @param {OrderBook} orderbook - The order book to be added.
   */
  addOrderbook(orderbook: OrderBook) {
    this.orderbooks.push(orderbook);
  }

  /**
   * Creates a new order in the specified market.
   * 
   * @param {string} market - The market identifier, e.g., "TATA_INR".
   * @param {string} price - The price at which the order is to be executed.
   * @param {string} quantity - The quantity to be bought or sold.
   * @param {"buy" | "sell"} side - Indicates whether the order is a buy or sell order.
   * @param {string} userId - The identifier of the user creating the order.
   */
  createOrder(
    market: string,
    price: string,
    quantity: string,
    side: "buy" | "sell",
    userId: string
  ) {
    const orderbook = this.orderbooks.find((o) => o.ticker() === market);
    const baseAsset = market.split("_")[0];
    const quoteAsset = market.split("_")[1];

    if (!orderbook) {
      throw new Error("No Order book found");
    }

    // Check if the user has sufficient funds and lock the necessary amounts
    this.checkAndLockFunds(baseAsset, quantity, side, userId, quoteAsset, price, quantity);

    // Create a new order object
    const order: Order = {
      price: Number(price),
      quantity: Number(quantity),
      orderId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      filled: 0,
      side,
      userId,
    }

    // Add the order to the order book and execute trades
    const { fills, executedQuantity } = orderbook.addOrder(order);

    // Update the user's balance based on the executed trades
    this.updateBalance(userId, baseAsset, quoteAsset, side, fills, executedQuantity)
  }

  /**
   * Checks whether a user has sufficient funds to create an order and locks the necessary amount.
   * 
   * @param {string} baseAsset - The base asset of the market (e.g., "TATA").
   * @param {string} quoteAsset - The quote asset of the market (e.g., "INR").
   * @param {"buy" | "sell"} side - Indicates whether the order is a buy or sell order.
   * @param {string} userId - The identifier of the user creating the order.
   * @param {string} asset - The asset involved in the trade (either base or quote asset).
   * @param {string} price - The price at which the order is to be executed.
   * @param {string} quantity - The quantity to be bought or sold.
   * 
   * @throws Will throw an error if the user has insufficient funds.
   */
  checkAndLockFunds(
    baseAsset: string,
    quoteAsset: string,
    side: "buy" | "sell",
    userId: string,
    asset: string,
    price: string,
    quantity: string
  ) {
    if (side === "buy") {
      // Check if the user has sufficient quote asset to cover the cost
      if (
        (this.balances.get(userId)?.[quoteAsset]?.available || 0) <
        Number(quantity) * Number(price)
      ) {
        throw new Error("Insufficient funds");
      }

      const available = this.balances.get(userId)?.[quoteAsset]?.available;
      const locked = this.balances.get(userId)?.[quoteAsset]?.locked;

      // Lock the required amount in the user's balance
      // @ts-ignore
      this.balances.get(userId)[quoteAsset].available = available - Number(quantity) * Number(price);

      // @ts-ignore
      this.balances.get(userId)[quoteAsset].locked = locked + Number(quantity) * Number(price);
    } else {
      // Check if the user has sufficient base asset to sell
      if (
        (this.balances.get(userId)?.[baseAsset]?.available || 0) < Number(quantity)) {
        throw new Error("Insufficient funds");
      }

      const available = this.balances.get(userId)?.[quoteAsset]?.available;
      const locked = this.balances.get(userId)?.[quoteAsset]?.locked;

      // Lock the required amount in the user's balance
      // @ts-ignore
      this.balances.get(userId)[baseAsset].available = available - Number(quantity);

      // @ts-ignore
      this.balances.get(userId)[baseAsset].locked = locked + Number(quantity);
    }
  }

  /**
   * Updates the user's balance based on the executed trades.
   * 
   * @param {string} userId - The identifier of the user.
   * @param {string} baseAsset - The base asset of the market.
   * @param {string} quoteAsset - The quote asset of the market.
   * @param {"buy" | "sell"} side - Indicates whether the order was a buy or sell order.
   * @param {Fill[]} fills - An array of trade fills resulting from the order.
   * @param {number} executedQty - The quantity of the order that was executed.
   */
  updateBalance(userId: string, baseAsset: string, quoteAsset: string, side: "buy" | "sell", fills: Fill[], executedQty: number) {
    if (side === 'buy') {
      fills.forEach(fill => {
        // Update quote asset balance for the counterparty
        //@ts-ignore
        this.balances.get(fill.otherUserId)[quoteAsset].available = this.balances.get(fill.otherUserId)?.[quoteAsset].available + (fill.qty * fill.price);

        // Deduct the locked quote asset balance for the user
        //@ts-ignore
        this.balances.get(userId)[quoteAsset].locked = this.balances.get(userId)?.[quoteAsset].locked - (fill.qty * fill.price);

        // Unlock the base asset balance for the counterparty
        // @ts-ignore
        this.balances.get(fill.otherUserId)[baseAsset].locked = this.balances.get(fill.otherUserId)?.[baseAsset].locked - fill.qty;

        // Add the executed base asset to the user's available balance
        // @ts-ignore
        this.balances.get(userId)[baseAsset].available = this.balances.get(userId)?.[baseAsset].available + fill.qty;
      });
      const notExecutedQty = Number(executedQty) - fills.reduce((sum, fill) => sum + fill.qty, 0);
      // Unlock the remaining quote asset balance for the user
      // @ts-ignore
      this.balances.get(userId)[quoteAsset].available = this.balances.get(userId)?.[quoteAsset].available + (notExecutedQty * Number(price));
      // Remove the locked amount of quote asset
      // @ts-ignore
      this.balances.get(userId)[quoteAsset].locked = this.balances.get(userId)?.[quoteAsset].locked - (notExecutedQty * Number(price));
    } else {
      fills.forEach(fill => {
        // Update base asset balance for the counterparty
        // @ts-ignore
        this.balances.get(fill.otherUserId)[baseAsset].available = this.balances.get(fill.otherUserId)?.[baseAsset].available + fill.qty;
        // Deduct the locked base asset balance for the user
        // @ts-ignore
        this.balances.get(userId)[baseAsset].locked = this.balances.get(userId)?.[baseAsset].locked - fill.qty;
        // Add the executed quote asset to the user's available balance
        // @ts-ignore
        this.balances.get(userId)[quoteAsset].available = this.balances.get(userId)?.[quoteAsset].available + (fill.qty * fill.price);
      });
      const notExecutedQty = Number(executedQty) - fills.reduce((sum, fill) => sum + fill.qty, 0);
      // Unlock the remaining base asset balance for the user
      // @ts-ignore
      this.balances.get(userId)[baseAsset].available = this.balances.get(userId)?.[baseAsset].available + notExecutedQty;
      // Remove the locked amount of base asset
      // @ts-ignore
      this.balances.get(userId)[baseAsset].locked = this.balances.get(userId)?.[baseAsset].locked - notExecutedQty;
    }
  }

  /**
   * Sets the initial balances for users based on predefined constants.
   */
  setBaseBalances() {
    const baseBalances: { [key: string]: UserBalance } = {
      "user-1": {
        "INR": {
          available: 10000,
          locked: 0,
        },
        "TATA": {
          available: 100,
          locked: 0,
        },
      },
      "user-2": {
        "INR": {
          available: 5000,
          locked: 0,
        },
        "TATA": {
          available: 50,
          locked: 0,
        },
      },
    };

    for (const [userId, balance] of Object.entries(baseBalances)) {
      this.balances.set(userId, balance);
    }
  }

  /**
   * Retrieves the current balance for a specific user.
   * 
   * @param {string} userId - The identifier of the user.
   * @returns {UserBalance | undefined} - The user's balance or undefined if the user is not found.
   */
  getBalance(userId: string): UserBalance | undefined {
    return this.balances.get(userId);
  }

  /**
   * Retrieves the current state of order books.
   * 
   * @returns {OrderBook[]} - An array of order books managed by the engine.
   */
  getOrderbooks(): OrderBook[] {
    return this.orderbooks;
  }
}
