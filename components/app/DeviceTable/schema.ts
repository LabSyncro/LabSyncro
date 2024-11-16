import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const AdminDeviceListSchema = Type.Object({
  id: Type.Number(),
  image: Type.String(),
  name: Type.String(),
  category: Type.String(),
  brand: Type.String(),
  borrowableQuantity: Type.Number(),
  totalQuantity: Type.Number(),
});

// Define the TypeScript type
export type AdminDeviceList = Static<typeof AdminDeviceListSchema>;
