import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const DeviceByLabSchema = Type.Object({
  name: Type.String(),
  borrowableQuantity: Type.Number(),
});

// Define the TypeScript type
export type DeviceByLab = Static<typeof DeviceByLabSchema>;
