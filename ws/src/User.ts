import { WebSocket } from "ws";
import { IncomingMessage, SUBSCRIBE, UNSUBSCRIBE } from "./types/in";
import { SubscriptionManager } from "./SubscriptionManager";
import { OutgoingMessage } from "./types/out";

export class User {
  private id: string;
  private ws: WebSocket;

  private subscriptions: string[] = [];

  constructor(id: string, ws: WebSocket) {
    this.id = id;
    this.ws = ws;
    this.addListeners();
  }

  public subscribe(subscription: string): void {
    this.subscriptions.push(subscription);
  }

  public unsubscribe(subscription: string): void {
    this.subscriptions = this.subscriptions.filter((s) => s !== subscription);
  }

  emit(message: OutgoingMessage) {
    this.ws.send(JSON.stringify(message));
  }

  addListeners() {
    this.ws.on("message", (message: string) => {
      const parsedMessage: IncomingMessage = JSON.parse(message);
      if (parsedMessage.method === SUBSCRIBE) {
        parsedMessage.params.forEach((s: string) => {
          SubscriptionManager.getInstance().subscribe(this.id, s);
        });
      } else if (parsedMessage.method === UNSUBSCRIBE) {
        parsedMessage.params.forEach((s: string) => {
          SubscriptionManager.getInstance().unsubscribe(
            this.id,
            parsedMessage.params[0]
          );
        });
      }
    });
  }
}
