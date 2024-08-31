import {
  CANCEL_ORDER,
  CREATE_ORDER,
  GET_DEPTH,
  GET_OPEN_ORDERS,
  GET_TRADE,
  ON_RAMP,
} from ".";

/**
 * Defines the possible messages that can be sent to the engine.
 * Each message type has a specific structure and carries data relevant to that action.
 *
 * @typedef {Object} MessageToEngine
 *
 * @property {typeof CREATE_ORDER} type - Indicates that the message is for creating a new order.
 * @property {Object} data - The data associated with creating the order.
 * @property {string} data.market - The market symbol (e.g., BTC/USD) where the order will be placed.
 * @property {string} data.price - The price at which the order is to be placed.
 * @property {string} data.quantity - The quantity of the asset to be ordered.
 * @property {"buy" | "sell"} data.side - The side of the order ("buy" or "sell").
 * @property {string} data.userId - The identifier of the user placing the order.
 *
 * @property {typeof CANCEL_ORDER} type - Indicates that the message is for canceling an existing order.
 * @property {Object} data - The data associated with canceling the order.
 * @property {string} data.orderId - The unique identifier of the order to be canceled.
 * @property {string} data.market - The market symbol (e.g., BTC/USD) where the order was placed.
 *
 * @property {typeof ON_RAMP} type - Indicates that the message is for handling on-ramp operations (e.g., depositing funds).
 * @property {Object} data - The data associated with the on-ramp operation.
 * @property {string} data.amount - The amount of funds to be processed.
 * @property {string} data.userId - The identifier of the user initiating the transaction.
 * @property {string} data.txnId - The unique transaction identifier for tracking.
 *
 * @property {typeof GET_DEPTH} type - Indicates that the message is to retrieve market depth information.
 * @property {Object} data - The data associated with retrieving market depth.
 * @property {string} data.market - The market symbol (e.g., BTC/USD) for which the depth is requested.
 *
 * @property {typeof GET_TRADE} type - Indicates that the message is to retrieve trade information.
 * @property {Object} data - The data associated with retrieving trade information.
 * @property {string} data.market - The market symbol (e.g., BTC/USD) for which the trade information is requested.
 *
 * @property {typeof GET_OPEN_ORDERS} type - Indicates that the message is to retrieve open orders.
 * @property {Object} data - The data associated with retrieving open orders.
 * @property {string} data.userId - The identifier of the user whose open orders are to be retrieved.
 * @property {string} data.market - The market symbol (e.g., BTC/USD) for which open orders are requested.
 */
export type MessageToEngine =
  | {
      type: typeof CREATE_ORDER;
      data: {
        market: string;
        price: string;
        quantity: string;
        side: "buy" | "sell";
        userId: string;
      };
    }
  | {
      type: typeof CANCEL_ORDER;
      data: {
        orderId: string;
        market: string;
      };
    }
  | {
      type: typeof ON_RAMP;
      data: {
        amount: string;
        userId: string;
        txnId: string;
      };
    }
  | {
      type: typeof GET_DEPTH;
      data: {
        market: string;
      };
    }
  | {
      type: typeof GET_TRADE;
      data: {
        market: string;
      };
    }
  | {
      type: typeof GET_OPEN_ORDERS;
      data: {
        userId: string;
        market: string;
      };
    };
