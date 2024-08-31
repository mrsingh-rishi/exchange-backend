import express from "express";
import cors from "cors";
import { orderRouter } from "./routes/order";
import { depthRouter } from "./routes/depth";
import { tradesRouter } from "./routes/trade";

/**
 * @constant {express.Express} app - An instance of the Express application.
 */
const app = express();

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
 * Starts the server and listens on port 3000.
 * @function
 * @param {number} port - The port number on which the server will listen.
 * @returns {void}
 */
app.listen(3000, () => {
  console.log("Server Listening on port 3000");
});
