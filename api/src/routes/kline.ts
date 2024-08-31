import { Client } from "pg";
import { Router } from "express";
import { RedisManager } from "../RedisManager";

// Initialize PostgreSQL client with connection parameters
const pgClient = new Client({
  user: "your_user",
  host: "localhost",
  database: "my_database",
  password: "your_password",
  port: 5432,
});

// Connect to the PostgreSQL database
pgClient.connect();

// Create a new router instance
export const klineRouter = Router();

/**
 * Handles GET requests to fetch Kline (candlestick) data from the database.
 *
 * @name GET / ("/")
 * @function
 * @param {Request} req - The HTTP request object. Expected query parameters:
 *   - `market` (string): The market symbol (e.g., BTC_USD).
 *   - `interval` (string): The interval for the Kline data (e.g., 1m, 1h, 1w).
 *   - `startTime` (number): The start time in Unix timestamp format.
 *   - `endTime` (number): The end time in Unix timestamp format.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Returns a JSON response with Kline data or an error message.
 *
 * @throws {400} Invalid interval - The interval provided is not supported.
 * @throws {500} Internal Server Error - An error occurred while querying the database.
 *
 * @example
 * // Example request: GET /?market=BTC_USD&interval=1h&startTime=1622505600&endTime=1622592000
 * // Example response: [{ close: 35000, end: '2024-06-01T01:00:00Z', high: 35500, low: 34000, open: 34500, quoteVolume: 50000, start: '2024-06-01T00:00:00Z', trades: 100, volume: 1000 }]
 */
klineRouter.get("/", async (req, res) => {
  // Extract query parameters from the request
  const { market, interval, startTime, endTime } = req.query;

  // Define the SQL query based on the interval
  let query;
  switch (interval) {
    case "1m":
      query = `SELECT * FROM klines_1m WHERE bucket >= $1 AND bucket <= $2`;
      break;
    case "1h":
      query = `SELECT * FROM klines_1h WHERE bucket >= $1 AND bucket <= $2`;
      break;
    case "1w":
      query = `SELECT * FROM klines_1w WHERE bucket >= $1 AND bucket <= $2`;
      break;
    default:
      return res.status(400).send("Invalid interval");
  }

  try {
    // Query the database with the constructed SQL query
    //@ts-ignore
    const result = await pgClient.query(query, [
      new Date((Number(startTime) * 1000).toString()),
      new Date((Number(endTime) * 1000).toString()),
    ]);

    // Respond with the formatted Kline data
    res.json(
      result.rows.map((x) => ({
        close: x.close,
        end: x.bucket,
        high: x.high,
        low: x.low,
        open: x.open,
        quoteVolume: x.quoteVolume,
        start: x.start,
        trades: x.trades,
        volume: x.volume,
      }))
    );
  } catch (err) {
    // Handle any errors that occur during the database query
    console.log(err);
    res.status(500).send(err);
  }
});
