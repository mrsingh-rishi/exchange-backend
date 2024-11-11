import { createClient, RedisClientType } from "redis";
import { UserManager } from "./UserManager";

export class SubscriptionManager {
  private static _instance: SubscriptionManager;

  private subscriptions: Map<string, string[]> = new Map();
  private reverseSubscriptions: Map<string, string[]> = new Map();
  private redisClient: RedisClientType;

  private constructor() {
    this.redisClient = createClient();
    this.redisClient.connect();
  }

  public static getInstance(): SubscriptionManager {
    if (!this._instance) {
      this._instance = new SubscriptionManager();
    }

    return this._instance;
  }

  public subscribe(userId: string, subscription: string): void {
    if (this.subscriptions.get(userId)?.includes(subscription)) {
      return;
    }

    this.subscriptions.set(
      userId,
      (this.subscriptions.get(userId) || []).concat(subscription)
    );

    this.reverseSubscriptions.set(
      subscription,
      (this.reverseSubscriptions.get(subscription) || []).concat(userId)
    );

    if (this.reverseSubscriptions.get(subscription)?.length === 1) {
      this.redisClient.subscribe(subscription, this.redisCallbackHandler);
    }
  }

  private redisCallbackHandler = (message: string, channel: string) => {
    const parsedMessage = JSON.parse(message);
    this.reverseSubscriptions
      .get(channel)
      ?.forEach((s) =>
        UserManager.getInstance().getUser(s)?.emit(parsedMessage)
      );
  };

  public unsubscribe(userId: string, subscription: string): void {
    const subscriptions = this.subscriptions.get(userId);
    if (subscriptions) {
      this.subscriptions.set(
        userId,
        subscriptions.filter((s) => s !== subscription)
      );
    }

    const reverseSubscriptions = this.reverseSubscriptions.get(subscription);

    if (reverseSubscriptions) {
      this.reverseSubscriptions.set(
        subscription,
        reverseSubscriptions.filter((s) => s !== userId)
      );

      if (this.reverseSubscriptions.get(subscription)?.length === 0) {
        this.reverseSubscriptions.delete(subscription);
        this.redisClient.unsubscribe(subscription);
      }
    }
  }

  public userLeft(userId: string): void {
    const subscriptions = this.subscriptions.get(userId);
    if (subscriptions) {
      subscriptions.forEach((subscription) => {
        this.unsubscribe(userId, subscription);
      });
    }
  }

  public getSubscriptions(userId: string): string[] {
    return this.subscriptions.get(userId) || [];
  }
}
