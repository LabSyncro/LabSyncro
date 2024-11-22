import * as db from 'zapatos/db';
import { INTERNAL_SERVER_ERROR_CODE, NOT_FOUND_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import { DeviceKindResourceDto } from '~/lib/api_schema';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

export default defineEventHandler<
  Promise<DeviceKindResourceDto>
>(async (event) => {
  const deviceKindId = Value.Convert(Type.String(), getRouterParam(event, 'id'));

  const [deviceKind] = await (db.sql`
      SELECT ${'device_kinds'}.${'unit'}, ${'device_kinds'}.${'brand'}, ${'device_kinds'}.${'description'}, ${'device_kinds'}.${'manufacturer'}, ${'device_kinds'}.${'image'}, ${'device_kinds'}.${'id'}, ${'device_kinds'}.${'name'}, count(*)::int as ${'quantity'}, sum(CASE WHEN ${'devices'}.${'status'} = 'healthy' THEN 1 ELSE 0 END)::int as borrowable_quantity, ${'categories'}.${'id'} as category_id, ${'categories'}.${'name'} as category_name
      FROM ${'devices'}
        JOIN ${'device_kinds'}
        ON ${'devices'}.${'kind'} = ${'device_kinds'}.${'id'} AND ${'devices'}.${'deleted_at'} IS NULL
        JOIN ${'categories'}
        ON ${'categories'}.${'id'} = ${'device_kinds'}.${'category_id'}
      WHERE ${'device_kinds'}.${'id'} = ${db.param(deviceKindId)} AND ${'device_kinds'}.${'deleted_at'} IS NULL
      GROUP BY ${'device_kinds'}.${'id'}, ${'categories'}.${'id'}
      `).run(dbPool);

  if (!deviceKind) {
    throw createError({
      statusCode: NOT_FOUND_CODE,
      message: 'Device kind not found!',
    });
  }

  const output = {
    id: deviceKind.id,
    unit: deviceKind.unit,
    name: deviceKind.name,
    brand: deviceKind.brand,
    manufacturer: deviceKind.manufacturer,
    mainImage: deviceKind.image.main_image,
    subImages: deviceKind.image.sub_images,
    quantity: deviceKind.quantity,
    borrowableQuantity: deviceKind.borrowable_quantity,
    categoryId: deviceKind.category_id,
    categoryName: deviceKind.category_name,
    description: deviceKind.description,
  };
  if (!Value.Check(DeviceKindResourceDto, output)) {
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error: the returned output does not conform to the schema',
    });
  }
  return output;

});
