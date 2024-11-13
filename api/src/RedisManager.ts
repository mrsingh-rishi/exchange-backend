import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { MessageToEngine } from "./types/to";
import { MessageFromOrderbook } from "./types";

/**
 * Manages Redis connections and messaging operations.
 */
export class RedisManager {
  private _client: RedisClientType;
  private _publisher: RedisClientType;
  private static _instance: RedisManager;

  /**
   * Private constructor to initialize Redis clients.
   * @private
   */
  private constructor() {
    this._client = createClient({
      url: process.env.REDIS_URL
    });
    this._client.connect();
    this._publisher = createClient({
      url: process.env.REDIS_URL
    });
    this._publisher.connect();
  }

  /**
   * Gets the singleton instance of the RedisManager.
   * @returns {RedisManager} The instance of the RedisManager.
   */
  public static getInstance(): RedisManager {
    if (!this._instance) {
      return (this._instance = new RedisManager());
    }

    return this._instance;
  }

  /**
   * Sends a message to the Redis queue and waits for a response.
   * @param {MessageToEngine} message - The message to send to the Redis queue.
   * @returns {Promise<MessageFromOrderbook>} A promise that resolves with the response from the Redis queue.
   */
  public sendAndWait(message: MessageToEngine): Promise<MessageFromOrderbook> {
    return new Promise<MessageFromOrderbook>((resolve) => {
      const id = this.getRandomClientId();
      console.log("Created Id for message", id);
      this._client.subscribe(id, (message) => {
        console.log("Received message", message);
        this._client.unsubscribe(id);
        console.log("Unsubscribed from channel", id);
        console.log("Parsed message", JSON.parse(message));
        resolve(JSON.parse(message));
      });
      console.log("Sending message", message);
      console.log("Message pushed to Redis queue");
      this._publisher.lPush(
        "messages",
        JSON.stringify({ clientId: id, message })
      );
    });
  }

  /**
   * Generates a random client ID.
   * @returns {string} A randomly generated client ID.
   */
  public getRandomClientId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
