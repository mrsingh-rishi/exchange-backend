import { Request, Response, Router } from "express";

export const tickersRouter = Router();

tickersRouter.get("/", async (req: Request, res: Response) => {
  res.json({});
});
