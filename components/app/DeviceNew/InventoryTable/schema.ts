import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const DeviceSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  kind: Type.String(),
  status: Type.String(),
  room: Type.String(),
  branch: Type.String(),
  price: Type.Number(),
  createdAt: Type.String(),
});

export type DeviceSchema = Static<typeof DeviceSchema>;
