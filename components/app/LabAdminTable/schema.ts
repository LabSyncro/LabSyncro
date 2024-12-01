import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";

export const LabManagedByAdmin = Type.Object({
  id: Type.String(),
  name: Type.String(),
  room: Type.String(),
  faculty: Type.String(),
  branch: Type.String(),
  timetable: Type.Record(Type.String(), Type.Array(Type.String())),
});

export type LabManagedByAdmin = Static<typeof LabManagedByAdmin>;
