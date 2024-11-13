import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";
import { DbMessage } from "./types";

const prisma = new PrismaClient();

async function main() {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
  await redisClient.connect();
  console.log("Connected to Redis");

  while (true) {
    const response = await redisClient.rPop("db_processor" as string);
    if (response) {
      const data: DbMessage = JSON.parse(response);

      if (data.type === "TRADE_ADDED") {
        console.log("Adding trade data");
        const trade = await prisma.trade.create({
          data: {
            price: parseFloat(data.data.price),
            quantity: parseFloat(data.data.quantity),
            timestamp: new Date(data.data.timestamp),
            market: data.data.market,
            isBuyerMaker: data.data.isBuyerMaker,
          },
        });

        // Update ticker with the latest trade price
        await prisma.ticker.upsert({
          where: { currencyCode: data.data.market },
          update: { currentPrice: trade.price },
          create: { currencyCode: data.data.market, currentPrice: trade.price },
        });
      } else if (data.type === "ORDER_UPDATE") {
        console.log("Updating order data");
        await prisma.order.upsert({
          where: { orderId: data.data.orderId },
          update: {
            executedQty: data.data.executedQty,
            market: data.data.market || undefined,
            price: data.data.price ? parseFloat(data.data.price) : undefined,
            quantity: data.data.quantity
              ? parseFloat(data.data.quantity)
              : undefined,
            side: data.data.side === "buy" ? "BUY" : "SELL",
          },
          create: {
            orderId: data.data.orderId,
            executedQty: data.data.executedQty,
            market: data.data.market || undefined,
            price: data.data.price ? parseFloat(data.data.price) : undefined,
            quantity: data.data.quantity
              ? parseFloat(data.data.quantity)
              : undefined,
            side: data.data.side === "buy" ? "BUY" : "SELL",
          },
        });
      }
    }
  }
}

main().catch(console.error);
