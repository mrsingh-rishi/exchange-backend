import { BASE_CURRENCY } from "./Engine";

/**
 * Represents an individual order in the order book.
 */
export interface Order {
  price: number; // The price at which the order is placed
  quantity: number; // The amount of asset to be traded
  orderId: string; // Unique identifier for the order
  filled: number; // Quantity of the order that has been filled
  side: "buy" | "sell"; // Indicates whether the order is a buy or sell order
  userId: string; // Identifier for the user who placed the order
}

/**
 * Represents a filled order.
 */
export interface Fill {
  price: string; // The price at which the trade was executed
  qty: number; // The quantity that was filled in the trade
  tradeId: number; // Unique identifier for the trade
  otherUserId: string; // The user ID of the counterparty
  markerOrderId: string; // The order ID of the maker order
}

/**
 * OrderBook class to manage bids, asks, and trades.
 */
export class OrderBook {
  bids: Order[]; // Array to store all the buy orders
  asks: Order[]; // Array to store all the sell orders
  baseAsset: string; // The asset being traded
  quoteAsset: string = BASE_CURRENCY; // The currency against which the asset is traded
  lastTradeId: number; // The ID of the last executed trade
  currentPrice: number; // The last traded price

  /**
   * Initializes a new instance of the OrderBook class.
   *
   * @param baseAsset - The asset being traded.
   * @param bids - The list of current buy orders.
   * @param asks - The list of current sell orders.
   * @param lastTradeId - The ID of the last trade executed.
   * @param currentPrice - The most recent trade price.
   */
  constructor(
    baseAsset: string,
    bids: Order[],
    asks: Order[],
    lastTradeId: number,
    currentPrice: number
  ) {
    this.bids = bids;
    this.asks = asks;
    this.baseAsset = baseAsset;
    this.lastTradeId = lastTradeId || 0;
    this.currentPrice = currentPrice || 0;
  }

  /**
   * Gets the ticker symbol for the asset pair.
   *
   * @return A string representing the ticker symbol.
   */
  ticker(): string {
    return `${this.baseAsset}_${this.quoteAsset}`;
  }

  /**
   * Gets a snapshot of the current state of the order book.
   *
   * @return An object containing the base asset, bids, asks, last trade ID, and current price.
   */
  getSnapshot() {
    return {
      baseAsset: this.baseAsset,
      bids: this.bids,
      asks: this.asks,
      lastTradeId: this.lastTradeId,
      currentPrice: this.currentPrice,
    };
  }

  /**
   * Adds an order to the order book.
   *
   * @param order - The order to be added.
   * @return An object containing the executed quantity and an array of fills.
   */
  addOrder(order: Order): {
    executedQuantity: number;
    fills: Fill[];
  } {
    console.log("Adding order", order);
    if (order.side === "buy") {
      console.log("Matching bid");
      const { executedQuantity, fills } = this.matchBid(order);
      order.filled = executedQuantity;
      if (executedQuantity === order.quantity) {
        return {
          fills,
          executedQuantity,
        };
      }

      console.log("Executed quantity", executedQuantity);
      this.bids.push(order);
      this.bids.sort((a, b) => b.price - a.price);
      console.log("Bids", this.bids);
      return {
        executedQuantity,
        fills,
      };
    } else {
      console.log("Matching ask");
      const { executedQuantity, fills } = this.matchAsk(order);
      order.filled = executedQuantity;
      if (executedQuantity === order.quantity) {
        console.log("Executed quantity", executedQuantity);
        return {
          fills,
          executedQuantity,
        };
      }
      console.log("Executed quantity", executedQuantity);
      this.asks.push(order);
      this.asks.sort((a, b) => a.price - b.price);
      console.log("Asks", this.asks);
      return {
        executedQuantity,
        fills,
      };
    }
  }

  /**
   * Matches a buy order with existing sell orders in the order book.
   *
   * @param order - The buy order to match.
   * @return An object containing the fills and the executed quantity.
   */
  matchBid(order: Order): {
    fills: Fill[];
    executedQuantity: number;
  } {
    const fills: Fill[] = [];
    let executedQuantity: number = 0;

    for (let i = 0; i < this.asks.length; i++) {
      if (
        this.asks[i].price < order.price &&
        executedQuantity < order.quantity &&
        order.userId !== this.asks[i].userId
      ) {
        const filledQuantity = Math.min(
          order.quantity - executedQuantity,
          this.asks[i].quantity - this.asks[i].filled
        );

        executedQuantity += filledQuantity;

        this.asks[i].filled = filledQuantity;

        fills.push({
          price: this.asks[i].price.toString(),
          qty: filledQuantity,
          tradeId: this.lastTradeId++,
          otherUserId: this.asks[i].userId,
          markerOrderId: order.orderId,
        });
      }
    }

    // Remove fully filled ask orders from the order book
    for (let i = 0; i < fills.length; i++) {
      if (this.asks[i].filled === this.asks[i].quantity) {
        this.asks.splice(i, 1);
        i--;
      }
    }

    return {
      fills,
      executedQuantity,
    };
  }

  /**
   * Matches a sell order with existing buy orders in the order book.
   *
   * @param order - The sell order to match.
   * @return An object containing the fills and the executed quantity.
   */
  matchAsk(order: Order) {
    const fills: Fill[] = [];
    let executedQuantity: number = 0;

    for (let i = 0; i < this.bids.length; i++) {
      if (
        this.bids[i].price >= order.price &&
        executedQuantity < order.quantity &&
        this.bids[i].userId < order.userId
      ) {
        const filledQuantity = Math.min(
          order.quantity - executedQuantity,
          this.bids[i].quantity - this.bids[i].filled
        );

        executedQuantity += filledQuantity;
        this.bids[i].filled += filledQuantity;

        fills.push({
          price: this.bids[i].price.toString(),
          qty: filledQuantity,
          tradeId: this.lastTradeId++,
          otherUserId: this.bids[i].userId,
          markerOrderId: order.orderId,
        });
      }
    }

    // Remove fully filled bid orders from the order book
    for (let i = 0; i < this.bids.length; i++) {
      if (this.bids[i].filled === this.bids[i].quantity) {
        this.bids.splice(i, 1);
        i--;
      }
    }

    return {
      fills,
      executedQuantity,
    };
  }

  /**
   * Gets the depth of the order book, showing aggregated bid and ask volumes by price level.
   *
   * @return An object containing arrays of bid and ask volumes.
   */
  getDepth() {
    const bids: [string, string][] = [];
    const asks: [string, string][] = [];

    const bidObj: { [key: string]: number } = {};
    const askObj: { [key: string]: number } = {};

    // Aggregate bid volumes by price level
    this.bids.forEach((order) => {
      if (!bidObj[order.price]) {
        bidObj[order.price] = 0;
      }
      bidObj[order.price] += order.quantity;
    });

    // Aggregate ask volumes by price level
    this.asks.forEach((order) => {
      if (!askObj[order.price]) {
        askObj[order.price] = 0;
      }
      askObj[order.price] += order.quantity;
    });

    // Convert bid volumes to array format
    for (const price in bidObj) {
      bids.push([price, bidObj[price].toString()]);
    }

    // Convert ask volumes to array format
    for (const price in askObj) {
      asks.push([price, askObj[price].toString()]);
    }

    return {
      bids,
      asks,
    };
  }

  /**
   * Retrieves open orders for a specific user.
   *
   * @param userId - The ID of the user whose orders are to be retrieved.
   * @return An array of open orders for the specified user.
   */
  getOpenOrders(userId: string): Order[] {
    const asks = this.asks.filter((x) => x.userId === userId);
    const bids = this.bids.filter((x) => x.userId === userId);

    return [...asks, ...bids];
  }

  /**
   * Cancels a bid order in the order book.
   *
   * @param order - The order to be canceled.
   * @return The price of the canceled order, or undefined if the order was not found.
   */
  cancelBid(order: Order): number | undefined {
    const index = this.bids.findIndex((b) => b.orderId === order.orderId);

    if (index !== -1) {
      const price = this.bids[index].price;
      this.bids.splice(index, 1);
      return price;
    }
  }

  /**
   * Cancels an ask order in the order book.
   *
   * @param order - The order to be canceled.
   * @return The price of the canceled order, or undefined if the order was not found.
   */
  cancelAsk(order: Order): number | undefined {
    const index = this.asks.findIndex((b) => b.orderId === order.orderId);

    if (index !== -1) {
      const price = this.asks[index].price;
      this.asks.splice(index, 1);
      return price;
    }
  }
}
