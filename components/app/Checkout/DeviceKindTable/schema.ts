import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const DeviceKindInCartList = Type.Object({
  id: Type.String(),
  name: Type.String(),
  quantity: Type.Number(),
});

export type DeviceKindInCartList = Static<typeof DeviceKindInCartList>;
