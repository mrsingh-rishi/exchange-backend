import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
import { MessageToEngine } from "./types/to";
import { MessageFromOrderbook } from "./types";

export class RedisManager {
  private _client: RedisClientType;
  private _publisher: RedisClientType;
  private static _instance: RedisManager;

  private constructor() {
    this._client = createClient();
    this._client.connect();
    this._publisher = createClient();
    this._publisher.connect();
  }

  public static getInstance() {
    if (!this._instance) {
      return (this._instance = new RedisManager());
    }

    return this._instance;
  }

  public sendAndWait(message: MessageToEngine) {
    return new Promise<MessageFromOrderbook>((resolve) => {
      const id = this.getRandomClientId();
      this._client.subscribe(id, (message) => {
        this._client.unsubscribe(id);
        resolve(JSON.parse(message));
      });
      this._publisher.lPush(
        "messages",
        JSON.stringify({ clientId: id, message })
      );
    });
  }

  public getRandomClientId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
