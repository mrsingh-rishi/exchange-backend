import { RedisClientType, createClient } from "redis";
import { TRADE_ADDED, ORDER_UPDATE } from "./types/index";
import { WsMessage } from "./types/toWs";
import { MessageToApi } from "./types/toApi";

/**
 * Type definition for messages handled by the Redis manager.
 *
 * @typedef DbMessage
 * @type {object}
 * @property {typeof TRADE_ADDED} type - The type of message, either TRADE_ADDED or ORDER_UPDATE.
 * @property {object} data - The data associated with the message.
 * @property {string} [data.id] - The trade ID (only for TRADE_ADDED type).
 * @property {boolean} [data.isBuyerMaker] - Indicates if the buyer is the maker (only for TRADE_ADDED type).
 * @property {string} [data.price] - The trade price.
 * @property {string} [data.quantity] - The trade quantity.
 * @property {string} [data.quoteQuantity] - The quote quantity.
 * @property {number} [data.timestamp] - The timestamp of the trade.
 * @property {string} [data.market] - The market symbol.
 * @property {string} [data.orderId] - The order ID (only for ORDER_UPDATE type).
 * @property {number} [data.executedQty] - The quantity executed (only for ORDER_UPDATE type).
 * @property {string} [data.market] - The market symbol (optional for ORDER_UPDATE type).
 * @property {string} [data.price] - The order price (optional for ORDER_UPDATE type).
 * @property {string} [data.quantity] - The order quantity (optional for ORDER_UPDATE type).
 * @property {"buy" | "sell"} [data.side] - The side of the order (optional for ORDER_UPDATE type).
 */
type DbMessage =
  | {
      type: typeof TRADE_ADDED;
      data: {
        id: string;
        isBuyerMaker: boolean;
        price: string;
        quantity: string;
        quoteQuantity: string;
        timestamp: number;
        market: string;
      };
    }
  | {
      type: typeof ORDER_UPDATE;
      data: {
        orderId: string;
        executedQty: number;
        market?: string;
        price?: string;
        quantity?: string;
        side?: "buy" | "sell";
      };
    };

/**
 * Manages interactions with Redis for message processing.
 */
export class RedisManager {
  private _client: RedisClientType; // Redis client instance
  private static _instance: RedisManager; // Singleton instance of RedisManager

  /**
   * Initializes a new instance of the RedisManager class.
   * Connects to the Redis server.
   */
  constructor() {
    this._client = createClient();
    this._client.connect();
  }

  /**
   * Gets the singleton instance of the RedisManager class.
   *
   * @return {RedisManager} The singleton instance of RedisManager.
   */
  public static getInstance(): RedisManager {
    if (!this._instance) {
      return (this._instance = new RedisManager());
    }

    return this._instance;
  }

  /**
   * Pushes a message to the "db_processor" list in Redis.
   *
   * @param {DbMessage} message - The message to be pushed.
   */
  public pushMessage(message: DbMessage): void {
    this._client.lPush("db_processor", JSON.stringify(message));
  }

  /**
   * Publishes a message to a specified Redis channel.
   *
   * @param {string} channel - The Redis channel to publish to.
   * @param {WsMessage} message - The message to be published.
   */
  public publishMessage(channel: string, message: WsMessage): void {
    this._client.publish(channel, JSON.stringify(message));
  }

  /**
   * Sends a message to a specific API client via Redis.
   *
   * @param {string} clientId - The ID of the API client to send the message to.
   * @param {MessageToApi} message - The message to be sent.
   */
  public sendToApi(clientId: string, message: MessageToApi): void {
    this._client.publish(clientId, JSON.stringify(message));
  }
}
