import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const DeviceInCartList = Type.Object({
  id: Type.String(),
  mainImage: Type.String(),
  name: Type.String(),
  brand: Type.Union([Type.String(), Type.Null()]),
  borrowableQuantity: Type.Number(),
  quantity: Type.Number(),
});

export type DeviceInCartList = Static<typeof DeviceInCartList>;
