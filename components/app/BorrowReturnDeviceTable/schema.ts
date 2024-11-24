import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const BorrowReturnDeviceSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  image: Type.String(),
  quantity: Type.Number(),
  borrowedPlace: Type.String(),
  returnedPlace: Type.String(),
  borrowedAt: Type.String({ format: 'date-time' }),
  expectedReturnedAt: Type.String({ format: 'date-time' }),
  status: Type.Union([Type.Literal('on_time'), Type.Literal('late')]),
});

export type BorrowReturnDevice = Static<typeof BorrowReturnDeviceSchema>;
