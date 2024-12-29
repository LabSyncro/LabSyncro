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

export const ReadyBorrowedDevicesResourceDto = Type.Object({
  devices: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
      mainImage: Type.String(),
      subImages: Type.Array(Type.String()),
      quantity: Type.Number(),
      place: Type.String(),
    }),
  ),
  totalPages: Type.Number(),
  currentPage: Type.Number(),
});

export type ReadyBorrowedDevicesResourceDto = Static<
  typeof ReadyBorrowedDevicesResourceDto
>;

export const ReturnedReceiptResourceDto = Type.Object({
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
      returnedAt: Type.Date(),
      status: Type.String(),
    }),
  ),
  totalPages: Type.Number(),
  currentPage: Type.Number(),
});

export type ReturnedReceiptResourceDto = Static<
  typeof ReturnedReceiptResourceDto
>;

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
      description: Type.Union([Type.String(), Type.Null()]),
      meta: Type.Union([
        Type.Record(
          Type.String(),
          Type.Union([Type.String(), Type.Number(), Type.Null()]),
        ),
        Type.Null(),
      ]),
      dataSheet: Type.Union([Type.String(), Type.Null()]),
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
      price: Type.String(),
      createdAt: Type.Date(),
      printedAt: Type.Union([Type.Date(), Type.Null()]),
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
  tel: Type.Union([Type.String(), Type.Null()]),
  name: Type.String(),
  email: Type.String(),
  last_active_at: Type.Date(),
  roles: Type.Array(Type.Object({ name: Type.String(), key: Type.String() })),
});

export type UserResourceDto = Static<typeof UserResourceDto>;

export const PrintQRCodeDto = Type.Object({
  id: Type.String(),
  name: Type.String(),
  url: Type.String(),
});

export type PrintQRCodeDto = Static<typeof PrintQRCodeDto>;

export const DeviceCheckerResourceDto = Type.Object({
  id: Type.String(),
  status: Type.String(),
  allowedBorrowRoles: Type.Array(Type.String()),
});

export type DeviceCheckerResourceDto = Static<typeof DeviceCheckerResourceDto>;

export const AdminManagedLabsDto = Type.Object({
  labs: Type.Array(
    Type.Object({
      id: Type.String(),
      branch: Type.String(),
      timetable: Type.Record(Type.String(), Type.Array(Type.String())),
      name: Type.String(),
      room: Type.String(),
    }),
  ),
  totalPages: Type.Number(),
  currentPage: Type.Number(),
});

export type AdminManagedLabsDto = Static<typeof AdminManagedLabsDto>;

export const RoleWithStatsDto = Type.Object({
  name: Type.String(),
  key: Type.String(),
  resources: Type.String(),
  users: Type.Number(),
  avatarUrl: Type.Array(Type.String()),
});

export type RoleWithStatsDto = Static<typeof RoleWithStatsDto>;
