import { Request, Response, Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_DEPTH } from "../types";

export const depthRouter = Router();

depthRouter.get("/", async (req: Request, res: Response) => {
  const { symbol } = req.query;
  const response = await RedisManager.getInstance().sendAndWait({
    type: GET_DEPTH,
    data: {
      market: symbol as string,
    },
  });

  res.json(response.payload);
});