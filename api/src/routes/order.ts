import { Request, Response, Router } from "express";
import { parseCancelOrderBody, parseCreateOrderBody } from "../validation";
import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_OPEN_ORDERS } from "../types";

// Create a new router instance for handling order-related routes
export const orderRouter = Router();

/**
 * Handles POST requests to create a new order.
 *
 * @name POST / ("/")
 * @function
 * @param {Request} req - The HTTP request object. Expected body parameters:
 *   - `market` (string): The market symbol (e.g., BTC_USD).
 *   - `price` (number): The price at which the order is to be created.
 *   - `userId` (string): The ID of the user creating the order.
 *   - `side` ("buy" | "sell"): The side of the order (buy or sell).
 *   - `quantity` (number): The quantity of the order.
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Returns a JSON response with the result of the order creation.
 *
 * @throws {400} Invalid request body - The request body does not meet validation criteria.
 * @throws {404} Internal error - An error occurred while processing the request.
 *
 * @example
 * // Example request body: { market: 'BTC_USD', price: 35000, userId: 'user123', side: 'buy', quantity: 1 }
 * // Example response: { success: true, orderId: 'order456' }
 */
orderRouter.post("/", async (req: Request, res: Response) => {
  try {
    if (!parseCreateOrderBody(req.body)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { market, price, userId, side, quantity } = req.body;

    console.log("Creating order", req.body);  // Log the order creation request

    

    const response = await RedisManager.getInstance().sendAndWait({
      type: CREATE_ORDER,
      data: {
        market,
        price,
        quantity,
        side,
        userId,
      },
    });

    return res.json(response.payload);
  } catch (error: any) {
    return res
      .status(404)
      .json({ message: "internal error", error: error.message });
  }
});

/**
 * Handles DELETE requests to cancel an existing order.
 *
 * @name DELETE / ("/")
 * @function
 * @param {Request} req - The HTTP request object. Expected body parameters:
 *   - `orderId` (string): The ID of the order to be canceled.
 *   - `market` (string): The market symbol (e.g., BTC_USD).
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Returns a JSON response with the result of the order cancellation.
 *
 * @throws {400} Invalid request body - The request body does not meet validation criteria.
 * @throws {404} Internal error - An error occurred while processing the request.
 *
 * @example
 * // Example request body: { orderId: 'order456', market: 'BTC_USD' }
 * // Example response: { success: true, message: 'Order canceled' }
 */
orderRouter.delete("/", async (req: Request, res: Response) => {
  try {
    if (!parseCancelOrderBody(req.body)) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const { orderId, market } = req.body;

    const response = await RedisManager.getInstance().sendAndWait({
      type: CANCEL_ORDER,
      data: { orderId, market },
    });

    return res.json(response.payload);
  } catch (error: any) {
    return res
      .status(404)
      .json({ message: "internal error", error: error.message });
  }
});

/**
 * Handles GET requests to retrieve open orders for a specific user.
 *
 * @name GET /open
 * @function
 * @param {Request} req - The HTTP request object. Expected query parameters:
 *   - `userId` (string): The ID of the user whose open orders are to be retrieved.
 *   - `market` (string): The market symbol (e.g., BTC_USD).
 * @param {Response} res - The HTTP response object.
 * @returns {Promise<void>} Returns a JSON response with the open orders for the user.
 *
 * @example
 * // Example query parameters: ?userId=user123&market=BTC_USD
 * // Example response: [{ orderId: 'order456', market: 'BTC_USD', price: 35000, quantity: 1, side: 'buy' }]
 */
orderRouter.get("/open", async (req: Request, res: Response) => {
  const response = await RedisManager.getInstance().sendAndWait({
    type: GET_OPEN_ORDERS,
    data: {
      userId: req.query.userId as string,
      market: req.query.market as string,
    },
  });
  res.json(response.payload);
});
