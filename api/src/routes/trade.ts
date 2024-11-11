import { Request, Response, Router } from "express";
import { prisma } from "..";

// Create a new router instance for handling trade-related routes
export const tradesRouter = Router();

/**
 * Handles GET requests to retrieve trade data for a specific market.
 *
 * @name GET / ("/")
 * @function
 * @param {Request} req - The HTTP request object. Expected query parameter:
 *   - `market` (string): The market symbol for which trade data is requested.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Returns a JSON response. The response body is an empty object by default.
 *
 * @example
 * // Example request: GET /?market=BTCUSD
 * // Example response: {}
 * // Note: Currently, this endpoint returns an empty object. It should be updated to include real trade data fetched from the database.
 */
tradesRouter.get("/", async (req: Request, res: Response) => {
  try {
    const { market } = req.query;

    const trades = await prisma.trade.findMany({
      where: {
        market: market as string,
      },
      orderBy: {
        timestamp: "desc",
      },
      take: 20,
    });
    res.json({ trades, message: "Trades fetched successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "An error occurred while fetching trades" });
  }
});
