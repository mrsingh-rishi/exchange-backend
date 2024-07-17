import { Request, Response, Router } from "express";
import { parseCancelOrderBody, parseCreateOrderBody } from "../validation";
import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_OPEN_ORDERS } from "../types";
export const orderRouter = Router();

orderRouter.post("/", async (req: Request, res: Response) => {
  try {
    if (!parseCreateOrderBody(req.body)) {
      return res.status(400).json({ message: "Invalid request body" });
    }
    const { market, price, userId, side, quantity } = req.body;

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
