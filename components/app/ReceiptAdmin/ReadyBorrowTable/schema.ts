import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const ReadyBorrowedDeviceSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  image: Type.String(),
  quantity: Type.Number(),
  place: Type.String(),
});

export type ReadyBorrowedDeviceSchema = Static<
  typeof ReadyBorrowedDeviceSchema
>;
