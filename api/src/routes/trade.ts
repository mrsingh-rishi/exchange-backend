import { Request, Response, Router } from "express";

export const tradesRouter = Router();

tradesRouter.get("/", async (req: Request, res: Response) => {
  const { market } = req.query;
  // get from DB
  res.json({});
});
