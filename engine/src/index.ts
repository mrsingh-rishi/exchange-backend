import { Engine } from "./trade/Engine";
import { createClient } from "redis";

async function main() {
  const engine = new Engine();
  const client = createClient();
  await client.connect();

  while (true) {
    const response = await client.rPop("messagess" as string);

    if (response) {
      const message = JSON.parse(response);
      engine.process(message);
    }
  }
}

main();
