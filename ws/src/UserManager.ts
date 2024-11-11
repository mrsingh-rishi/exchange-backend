import { WebSocket } from "ws";
import { User } from "./User";
import { SubscriptionManager } from "./SubscriptionManager";

export class UserManager {
  private static _instance: UserManager;
  private users: Map<string, User> = new Map();

  private constructor() {}

  public static getInstance(): UserManager {
    if (!this._instance) {
      this._instance = new UserManager();
    }

    return this._instance;
  }

  addUser(ws: WebSocket) {
    const id = this.getRandomId();
    const user = new User(id, ws);
    this.users.set(id, user);
    this.registerOnClose(ws, id);
  }

  private registerOnClose(ws: WebSocket, id: string) {
    ws.on("close", () => {
      this.users.delete(id);
      SubscriptionManager.getInstance().userLeft(id);
    });
  }

  getUser(id: string) {
    return this.users.get(id);
  }

  private getRandomId() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
