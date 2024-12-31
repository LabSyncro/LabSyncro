import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const ReturnDeviceSchema = Type.Object({
  id: Type.Number(),
  name: Type.String(),
  image: Type.String(),
  borrowedPlace: Type.String(),
  returnedPlace: Type.String(),
  borrowedAt: Type.Date(),
  expectedReturnedAt: Type.Date(),
  returnedAt: Type.Date(),
  status: Type.Union([Type.Literal('on_time'), Type.Literal('late')]),
  note: Type.Optional(Type.String()),
  deviceStatus: Type.Union([
    Type.Literal('healthy'),
    Type.Literal('broken'),
    Type.Literal('assessing'),
    Type.Literal('lost'),
  ]),
});

export type ReturnDevice = Static<typeof ReturnDeviceSchema>;
