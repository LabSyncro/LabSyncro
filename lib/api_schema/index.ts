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

export type ListOfCategoryResourceDto = Static<
  typeof ListOfCategoryResourceDto
>;

export const FacultyResourceDto = Type.Object({
  faculties: Type.Array(
    Type.Object({
      id: Type.Number(),
      name: Type.String(),
    }),
  ),
});

export type FacultyResourceDto = Static<typeof FacultyResourceDto>;

export const ReceiptResourceDto = Type.Object({
  receipts: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
      mainImage: Type.String(),
      subImages: Type.Array(Type.String()),
      quantity: Type.Number(),
      borrowedPlace: Type.String(),
      returnedPlace: Type.String(),
      borrowedAt: Type.Date(),
      expectedReturnedAt: Type.Date(),
      status: Type.String(),
    }),
  ),
  totalPages: Type.Number(),
  currentPage: Type.Number(),
});

export type ReceiptResourceDto = Static<typeof ReceiptResourceDto>;

export const DeviceQuantityByLabDto = Type.Object({
  labs: Type.Array(
    Type.Object({
      name: Type.String(),
      branch: Type.String(),
      room: Type.String(),
      borrowableQuantity: Type.Number(),
    }),
  ),
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
  quantity: Type.Number(),
  borrowableQuantity: Type.Number(),
  categoryId: Type.String(),
  categoryName: Type.String(),
  description: Type.String(),
});

export type DeviceKindResourceDto = Static<typeof DeviceKindResourceDto>;

export const ListOfDeviceKindResourceDto = Type.Object({
  deviceKinds: Type.Array(
    Type.Object({
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
    }),
  ),
  totalPages: Type.Number(),
  currentPage: Type.Number(),
});

export type ListOfDeviceKindResourceDto = Static<
  typeof ListOfDeviceKindResourceDto
>;

export const ListOfDeviceResourceDto = Type.Object({
  devices: Type.Array(
    Type.Object({
      id: Type.String(),
      kind: Type.String(),
      status: Type.String(),
      room: Type.String(),
      branch: Type.String(),
    }),
  ),
  totalPages: Type.Number(),
  currentPage: Type.Number(),
});

export type ListOfDeviceResourceDto = Static<typeof ListOfDeviceResourceDto>;

export const ListOfLabResourceDto = Type.Object({
  labs: Type.Array(
    Type.Object({
      id: Type.String(),
      branch: Type.String(),
      timetable: Type.Record(Type.String(), Type.Array(Type.String())),
      adminId: Type.String(),
      adminName: Type.String(),
      adminTel: Type.Union([Type.Null(), Type.String()]),
      name: Type.String(),
      room: Type.String(),
    }),
  ),
});

export type ListOfLabResourceDto = Static<typeof ListOfLabResourceDto>;

export const UserResourceDto = Type.Object({
  id: Type.String(),
  avatar: Type.Union([Type.String(), Type.Null()]),
  tel: Type.String(),
  name: Type.String(),
  email: Type.String(),
  role: Type.Union([
    Type.Literal('student'),
    Type.Literal('teacher'),
    Type.Literal('sysadmin'),
    Type.Literal('lab_admin'),
  ]),
});

export type UserResourceDto = Static<typeof UserResourceDto>;
