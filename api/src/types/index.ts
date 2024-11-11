// Define action types as constants for use in message handling
export const CREATE_ORDER = "CREATE_ORDER"; // Action type for creating a new order
export const CANCEL_ORDER = "CANCEL_ORDER"; // Action type for canceling an existing order
export const ON_RAMP = "ON_RAMP"; // Action type for handling on-ramp operations (context-specific)
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS"; // Action type for fetching open orders
export const GET_USER_BALANCE = "GET_USER_BALANCE";
export const GET_DEPTH = "GET_DEPTH"; // Action type for retrieving market depth
export const GET_TRADE = "GET_TRADE"; // Action type for retrieving trade information

/**
 * Type definition for messages received from the order book.
 *
 * This type is used to describe different types of messages that the order book might send.
 *
 * @typedef {Object} MessageFromOrderbook
 * @property {"DEPTH"} type - Indicates that the message contains market depth data.
 * @property {Object} payload - The payload containing market depth details.
 * @property {string} payload.market - The market symbol for which the depth data is provided.
 * @property {[string, string][]} payload.bids - Array of bid prices and quantities.
 * @property {[string, string][]} payload.asks - Array of ask prices and quantities.
 *
 * @typedef {Object} OrderPlacedMessage
 * @property {"ORDER_PLACED"} type - Indicates that the message contains information about an order placement.
 * @property {Object} payload - The payload containing order placement details.
 * @property {string} payload.orderId - The unique identifier of the order placed.
 * @property {number} payload.executedQty - The quantity of the order that was executed.
 * @property {Object[]} payload.fills - Array of fill details associated with the order.
 * @property {string} payload.fills[].price - The price at which the fill occurred.
 * @property {number} payload.fills[].qty - The quantity of the fill.
 * @property {number} payload.fills[].tradeId - The unique identifier of the trade.
 *
 * @typedef {Object} OrderCancelledMessage
 * @property {"ORDER_CANCELLED"} type - Indicates that the message contains information about an order cancellation.
 * @property {Object} payload - The payload containing order cancellation details.
 * @property {string} payload.orderId - The unique identifier of the order cancelled.
 * @property {number} payload.executedQty - The quantity of the order that was executed before cancellation.
 * @property {number} payload.remainingQty - The remaining quantity of the order after cancellation.
 *
 * @typedef {Object} OpenOrdersMessage
 * @property {"OPEN_ORDERS"} type - Indicates that the message contains information about open orders.
 * @property {Object[]} payload - Array of open orders.
 * @property {string} payload[].orderId - The unique identifier of the open order.
 * @property {number} payload[].executedQty - The quantity of the order that was executed.
 * @property {string} payload[].price - The price of the open order.
 * @property {string} payload[].quantity - The quantity of the open order.
 * @property {"buy" | "sell"} payload[].side - The side of the order, either "buy" or "sell".
 * @property {string} payload[].userId - The identifier of the user who placed the order.
 *
 * The MessageFromOrderbook type is a union type of the different message formats that can be received.
 */
export type MessageFromOrderbook =
  | {
      type: "DEPTH";
      payload: {
        market: string; // Market symbol (e.g., BTC/USD)
        bids: [string, string][]; // Array of bid price and quantity pairs
        asks: [string, string][]; // Array of ask price and quantity pairs
      };
    }
  | {
      type: "ORDER_PLACED";
      payload: {
        orderId: string; // Unique order identifier
        executedQty: number; // Quantity of the order that was executed
        fills: {
          price: string; // Price at which the fill occurred
          qty: number; // Quantity of the fill
          tradeId: number; // Unique trade identifier
        }[]; // Array of fill details
      };
    }
  | {
      type: "ORDER_CANCELLED";
      payload: {
        orderId: string; // Unique order identifier
        executedQty: number; // Quantity of the order that was executed before cancellation
        remainingQty: number; // Remaining quantity of the order after cancellation
      };
    }
  | {
      type: "OPEN_ORDERS";
      payload: {
        orderId: string; // Unique order identifier
        executedQty: number; // Quantity of the order that was executed
        price: string; // Price of the open order
        quantity: string; // Quantity of the open order
        side: "buy" | "sell"; // Side of the order
        userId: string; // Identifier of the user who placed the order
      }[];
    }
  | {
      type: "ET_USER_BALANCE";
      payload: {
        [key: string]: {
          available: number;
          locked: number;
        };
      };
    };
