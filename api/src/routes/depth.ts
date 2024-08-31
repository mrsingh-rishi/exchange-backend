import { Request, Response, Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_DEPTH } from "../types";

// Create a new router instance
export const depthRouter = Router();

/**
 * Handles GET requests to fetch market depth information.
 *
 * @name GET / ("/")
 * @function
 * @param {Request} req - The HTTP request object. Expected query parameter: `symbol` (the market symbol).
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Returns a JSON response with the market depth data.
 *
 * @example
 * // Example request: GET /?symbol=BTC_USD
 * // Example response: { bids: [...], asks: [...] }
 */
depthRouter.get("/", async (req: Request, res: Response) => {
  // Extract the market symbol from the query parameters
  const { symbol } = req.query;

  try {
    // Send a request to Redis and wait for the response
    const response = await RedisManager.getInstance().sendAndWait({
      type: GET_DEPTH,
      data: {
        market: symbol as string, // Type assertion for symbol to string
      },
    });

    // Respond with the payload from Redis
    res.json(response.payload);
  } catch (error) {
    // Handle any errors that occur during the Redis operation
    console.error("Error fetching market depth:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
