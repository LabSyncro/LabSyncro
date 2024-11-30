import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const ReturnedReceiptDeviceSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  image: Type.String(),
  quantity: Type.Number(),
  borrowedPlace: Type.String(),
  returnedPlace: Type.String(),
  borrowedAt: Type.Date(),
  expectedReturnedAt: Type.Date(),
  returnedAt: Type.Date(),
  status: Type.Union([Type.Literal('on_time'), Type.Literal('late')]),
});

export type ReturnedReceiptDevice = Static<typeof ReturnedReceiptDeviceSchema>;
