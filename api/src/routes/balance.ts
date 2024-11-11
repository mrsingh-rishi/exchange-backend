import { Router } from "express";
import { RedisManager } from "../RedisManager";
import { GET_USER_BALANCE } from "../types";

export const balanceRouter = Router();

balanceRouter.get("/", async (req, res) => {
  const { userId } = req.query;

  const response = await RedisManager.getInstance().sendAndWait({
    type: GET_USER_BALANCE,
    data: {
      userId: userId as string,
    },
  });

  res.json(response.payload);
});
