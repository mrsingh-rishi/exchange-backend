import { Engine } from "./trade/Engine";
import { createClient } from "redis";

async function main() {
  const engine = new Engine();
  const client = createClient({
    url: process.env.REDIS_URL,
  });
  await client.connect();

  while (true) {
    const response = await client.rPop("messages" as string);
    if (response) {
      const message = JSON.parse(response);
      console.log("Received message", JSON.parse(response));
      engine.process(message);
    }
  }
}

main();
