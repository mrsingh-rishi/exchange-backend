import { Request, Response, Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_TRADE } from "../types";

export const tradeRouter = Router();

tradeRouter.get("/", async (req: Request, res: Response) => {
  const { symbol } = req.query;
  const response = await RedisManager.getInstance().sendAndWait({
    type: GET_TRADE,
    data: {
      market: symbol as string,
    },
  });

  res.json(response.payload);
});
