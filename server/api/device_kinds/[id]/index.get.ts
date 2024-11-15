import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { NOT_FOUND_CODE } from '~/constants';
import { dbPool } from '~/server/db';

const DeviceKindOutputDto = Type.Object({
  id: Type.Number(),
  unit: Type.String(),
  name: Type.String(),
  brand: Type.Optional(Type.String()),
  manufacturer: Type.Optional(Type.String()),
  mainImage: Type.String(),
  subImages: Type.Array(Type.String()),
  quantity: Type.String(),
  categoryId: Type.String(),
  categoryName: Type.String(),
  description: Type.String(),
});

type DeviceKindOutputDto = Static<typeof DeviceKindOutputDto>;

export default defineEventHandler<
  Promise<DeviceKindOutputDto>
>(async (event) => {
  const deviceKindId = Number.parseInt(getRouterParam(event, 'id')!);
  try {
    const [deviceKind] = await (db.sql`
      SELECT ${'device_kinds'}.${'unit'}, ${'device_kinds'}.${'brand'}, ${'device_kinds'}.${'description'}, ${'device_kinds'}.${'manufacturer'}, ${'device_kinds'}.${'image'}, ${'device_kinds'}.${'id'}, ${'device_kinds'}.${'name'}, count(*) as ${'quantity'}, ${'categories'}.${'id'} as category_id, ${'categories'}.${'name'} as category_name
      FROM ${'devices'}
        JOIN ${'device_kinds'}
        ON ${'devices'}.${'kind'} = ${'device_kinds'}.${'id'}
        JOIN ${'categories'}
        ON ${'categories'}.${'id'} = ${'device_kinds'}.${'category_id'}
      WHERE ${'device_kinds'}.${'id'} = ${db.param(deviceKindId)}
      GROUP BY ${'device_kinds'}.${'id'}, ${'categories'}.${'id'}
      `).run(dbPool);

    return {
      id: deviceKind.id,
      unit: deviceKind.unit,
      name: deviceKind.name,
      brand: deviceKind.brand,
      manufacturer: deviceKind.manufacturer,
      mainImage: deviceKind.image.main_image,
      subImages: deviceKind.image.sub_images,
      quantity: deviceKind.quantity,
      categoryId: deviceKind.category_id,
      categoryName: deviceKind.category_name,
      description: deviceKind.description,
    };
  } catch {
    throw createError({
      statusCode: NOT_FOUND_CODE,
      message: 'Device kind not found!',
    });
  }
});
