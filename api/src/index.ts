import express from "express";
import cors from "cors";
import { orderRouter } from "./routes/order";
import { depthRouter } from "./routes/depth";
import { tradesRouter } from "./routes/trade";
import { balanceRouter } from "./routes/balance";
import { onRampRouter } from "./routes/onRamp";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { tickersRouter } from "./routes/ticker";

dotenv.config();

/**
 * @constant {PrismaClient} prisma - An instance of the PrismaClient.
 */
export const prisma = new PrismaClient();

/**
 * @constant {express.Express} app - An instance of the Express application.
 */
const app = express();

const port = process.env.PORT || 3000;

/**
 * Middleware to enable CORS (Cross-Origin Resource Sharing).
 * @function
 */
app.use(cors());

/**
 * Middleware to parse JSON bodies in requests.
 * @function
 */
app.use(express.json());

app.get("/", (req, res) => {
  res.send("api service is available");
});

/**
 * Routes related to order operations.
 * @function
 * @name orderRouter
 * @path {POST} /api/v1/order
 */
app.use("/api/v1/order", orderRouter);

/**
 * Routes related to market depth.
 * @function
 * @name depthRouter
 * @path {GET} /api/v1/depth
 */
app.use("/api/v1/depth", depthRouter);

/**
 * Routes related to trades.
 * @function
 * @name tradesRouter
 * @path {GET} /api/v1/trade
 */
app.use("/api/v1/trade", tradesRouter);

/**
 * Routes related to user balance.
 * @function
 * @name balanceRouter
 * @path {GET} /api/v1/balance
 * @param {string} userId - The user ID for which to fetch the balance.
 */
app.use("/api/v1/balance", balanceRouter);

/**
 * Routes related to on-ramp (deposit) operations.
 * @function
 * @name onRampRouter
 * @path {POST} /api/v1/onRamp
 * @body {string} userId - The user ID for which to fetch the on-ramp operation
 * @body {string} amount - The amount to add to the balance
 *
 */
app.use("/api/v1/onRamp", onRampRouter);

app.use("/api/v1/tickers", tickersRouter);

/**
 * Starts the server and listens on port 3000.
 * @function
 * @param {number} port - The port number on which the server will listen.
 * @returns {void}
 */
app.listen(port, () => {
  console.log("Server Listening on port " + port);
});

export default app;
