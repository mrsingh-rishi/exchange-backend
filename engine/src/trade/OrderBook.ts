import { BASE_CURRENCY } from "./Engine";

export interface Order {
  price: number;
  quantity: number;
  orderId: string;
  filled: number;
  side: "buy" | "sell";
  userId: string;
}

export interface Fill {
  price: string;
  qty: number;
  tradeId: number;
  otherUserId: string;
  markerOrderId: string;
}

export class OrderBook {
  bids: Order[];
  asks: Order[];
  baseAssets: string;
  quoteAssets: string = BASE_CURRENCY;
  lastTradeId: number;
  currentPrice: number;

  constructor(
    baseAsset: string,
    bids: Order[],
    asks: Order[],
    lastTradeId: number,
    currentPrice: number
  ) {
    this.bids = bids;
    this.asks = asks;
    this.baseAssets = baseAsset;
    this.lastTradeId = lastTradeId || 0;
    this.currentPrice = currentPrice || 0;
  }

  ticker() {
    return `${this.baseAssets}_${this.quoteAssets}`;
  }

  getSnapshot() {
    return {
      baseAssets: this.baseAssets,
      bids: this.bids,
      asks: this.asks,
      lastTradeId: this.lastTradeId,
      currentPrice: this.currentPrice,
    };
  }

  addOrder(order: Order): {
    executedQuantity: number;
    fills: Fill[];
  } {
    if (order.side === "buy") {
      const { executedQuantity, fills } = this.matchBid(order);
      order.filled = executedQuantity;
      if (executedQuantity === order.quantity) {
        return {
          fills,
          executedQuantity,
        };
      }

      this.bids.push(order);
      return {
        executedQuantity,
        fills,
      };
    } else {
      const { executedQuantity, fills } = this.matchAsk(order);
      order.filled = executedQuantity;
      if (executedQuantity === order.quantity) {
        return {
          fills,
          executedQuantity,
        };
      }
      this.asks.push(order);
      return {
        executedQuantity,
        fills,
      };
    }
  }

  matchBid(order: Order): {
    fills: Fill[];
    executedQuantity: number;
  } {
    const fills: Fill[] = [];
    let executedQuantity: number = 0;

    for (let i = 0; i < this.asks.length; i++) {
      if (
        this.asks[i].price < order.price &&
        executedQuantity < order.quantity
      ) {
        const filledQuantity = Math.min(
          order.quantity - executedQuantity,
          this.asks[i].quantity
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

  matchAsk(order: Order) {
    const fills: Fill[] = [];
    let executedQuantity: number = 0;

    for (let i = 0; i < this.bids.length; i++) {
      if (
        this.bids[i].price >= order.price &&
        executedQuantity < order.quantity
      ) {
        const filledQuantity = Math.min(
          order.quantity - executedQuantity,
          this.bids[i].quantity
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
}
