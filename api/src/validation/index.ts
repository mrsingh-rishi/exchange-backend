import zod from "zod";

const createOrderSchema = zod.object({
  market: zod.string(),
  side: zod.string(),
  quantity: zod.string(),
  price: zod.string(),
  userId: zod.string(),
});

const cancelOrderSchema = zod.object({
  market: zod.string(),
  orderId: zod.string(),
});

export function parseCreateOrderBody(body: any) {
  const { success } = createOrderSchema.safeParse(body);

  return success;
}

export function parseCancelOrderBody(body: any) {
  const { success } = cancelOrderSchema.safeParse(body);

  return success;
}
