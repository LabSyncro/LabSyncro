import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';

export const CategoryResourceDto = Type.Object({
  id: Type.String(),
  name: Type.String(),
});

export type CategoryResourceDto = Static<typeof CategoryResourceDto>;

export const ListOfCategoryResourceDto = Type.Object({
  categories: Type.Any(CategoryResourceDto),
});

export type ListOfCategoryResourceDto = Static<typeof ListOfCategoryResourceDto>;

export const FacultyResourceDto = Type.Object({
  faculties: Type.Array(Type.Object({
    id: Type.Number(),
    name: Type.String(),
  })),
});

export type FacultyResourceDto = Static<typeof FacultyResourceDto>;

export const ReceiptResourceDto = Type.Object({
  branches: Type.Array(
    Type.Object({
      name: Type.String(),
      labs: Type.Array(
        Type.Object({
          branch: Type.String(),
          timetable: Type.Record(Type.String(), Type.Array(Type.String())),
          adminId: Type.String(),
          adminName: Type.String(),
          adminTel: Type.String(),
          name: Type.String(),
          room: Type.String(),
        }),
      ),
    }),
  ),
});

export type ReceiptResourceDto = Static<typeof ReceiptResourceDto>;

export const DeviceQuantityByLabDto = Type.Object({
  labs: Type.Array(Type.Object({
    name: Type.String(),
    branch: Type.String(),
    room: Type.String(),
    borrowableQuantity: Type.Number(),
  })),
});

export type DeviceQuantityByLabDto = Static<typeof DeviceQuantityByLabDto>;

export const DeviceKindResourceDto = Type.Object({
  id: Type.String(),
  unit: Type.String(),
  name: Type.String(),
  brand: Type.Union([Type.String(), Type.Null()]),
  manufacturer: Type.Union([Type.String(), Type.Null()]),
  mainImage: Type.String(),
  subImages: Type.Array(Type.String()),
  quantity: Type.String(),
  categoryId: Type.String(),
  categoryName: Type.String(),
  description: Type.String(),
});

export type DeviceKindResourceDto = Static<typeof DeviceKindResourceDto>;

export const ListOfDeviceKindResourceDto = Type.Object({
  deviceKinds: Type.Array(Type.Object({
    id: Type.String(),
    name: Type.String(),
    brand: Type.Union([Type.String(), Type.Null()]),
    manufacturer: Type.Union([Type.String(), Type.Null()]),
    mainImage: Type.String(),
    subImages: Type.Array(Type.String()),
    quantity: Type.Number(),
    borrowableQuantity: Type.Number(),
    category: Type.String(),
    unit: Type.String(),
  })),
  totalPages: Type.Number(),
  currentPage: Type.Number(),
});

export type ListOfDeviceKindResourceDto = Static<typeof ListOfDeviceKindResourceDto>;

export const LabResourceDto = Type.Object({
  branches: Type.Array(Type.Object({
    name: Type.String(),
    labs: Type.Array(Type.Object({
      branch: Type.String(),
      timetable: Type.Record(Type.String(), Type.Array(Type.String())),
      adminId: Type.String(),
      adminName: Type.String(),
      adminTel: Type.String(),
      name: Type.String(),
      room: Type.String(),
    })),
  })),
});

export type LabResourceDto = Static<typeof LabResourceDto>;
