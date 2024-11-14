import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const BorrowReturnDeviceSchema = Type.Object({
  id: Type.Number(),
  image: Type.String(),
  name: Type.String(),
  quantity: Type.Number(),
  lab: Type.String(),
  facility: Type.String(),
  borrowDate: Type.String({ format: 'date-time' }),
  returnDate: Type.String({ format: 'date-time' }),
  status: Type.Union([Type.Literal('On Time'), Type.Literal('Late')]),
});

// Define the TypeScript type
export type BorrowReturnDevice = Static<typeof BorrowReturnDeviceSchema>;
