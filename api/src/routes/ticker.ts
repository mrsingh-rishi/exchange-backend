import { Request, Response, Router } from "express";
import { prisma } from "..";

// Create a new router instance for handling ticker-related routes
export const tickersRouter = Router();

/**
 * Handles GET requests to retrieve ticker data.
 *
 * @name GET / ("/")
 * @function
 * @param {Request} req - The HTTP request object. This endpoint does not expect any specific query parameters.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Returns a JSON response. The response body is an empty object by default.
 *
 * @example
 * // Example response: {}
 * // This endpoint might be updated to include real ticker data in the future.
 */
tickersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const tickers = await prisma.ticker.findMany({
      orderBy: {
        lastUpdatedAt: "desc",
      },
      take: 100, // Limit the results to the most recent 100 tickers
    });
    res.json({ tickers, message: "Tickers fetched successfully" });
  } catch (e) {
    console.log(e);

    res.status(500).json({ error: "An error occurred while fetching tickers" });
  }
});
