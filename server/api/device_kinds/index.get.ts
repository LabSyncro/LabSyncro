import { Type } from '@sinclair/typebox';
import type { Static } from '@sinclair/typebox';
import * as db from 'zapatos/db';
import { dbPool } from '~/server/db';

const DeviceKindOutputDto = Type.Object({
  deviceKinds: Type.Array(Type.Object({
    id: Type.String(),
    name: Type.String(),
    brand: Type.String(),
    manufacturer: Type.String(),
    mainImage: Type.String(),
    subImages: Type.Array(Type.String()),
    quantity: Type.String(),
  })),
});

type DeviceKindOutputDto = Static<typeof DeviceKindOutputDto>;

export default defineEventHandler<
  { query: { category_id?: number, offset: number, length: number } },
  Promise<DeviceKindOutputDto>
>(async (event) => {
  const { category_id: categoryId, offset, length } = getQuery(event);
  if (typeof categoryId === 'number') {
    const deviceKinds = await (db.sql`
      SELECT ${'device_kinds'}.${'unit'}, ${'device_kinds'}.${'brand'}, ${'device_kinds'}.${'manufacturer'}, ${'device_kinds'}.${'image'}, ${'device_kinds'}.${'id'}, ${'device_kinds'}.${'name'}, count(*) as ${'quantity'}
      FROM ${'devices'}
        JOIN ${'device_kinds'}
        ON ${'devices'}.${'kind'} = ${'device_kinds'}.${'id'}
        JOIN ${'menus'}
        ON ${'menus'}.${'id'} = ${'device_kinds'}.${'menu_id'}
      WHERE ${'menu_id'} = ${db.param(categoryId)}
      GROUP BY ${'device_kinds'}.${'id'}
      ORDER BY ${'device_kinds'}.${'id'}
      LIMIT ${db.param(length)}
      OFFSET ${db.param(offset)}
      `).run(dbPool);
    return {
      deviceKinds: deviceKinds.map(({ id, name, quantity, brand, manufacturer, image: { main_image, sub_images }, unit }) => ({ id, name, quantity, brand, manufacturer, mainImage: main_image, subImages: sub_images, unit })),
    };
  }
  const deviceKinds = await (db.sql`
      SELECT ${'device_kinds'}.${'unit'}, ${'device_kinds'}.${'brand'}, ${'device_kinds'}.${'manufacturer'}, ${'device_kinds'}.${'image'}, ${'device_kinds'}.${'id'}, ${'device_kinds'}.${'name'}, count(*) as ${'quantity'}
      FROM ${'devices'}
        JOIN ${'device_kinds'}
        ON ${'devices'}.${'kind'} = ${'device_kinds'}.${'id'}
        JOIN ${'menus'}
        ON ${'menus'}.${'id'} = ${'device_kinds'}.${'menu_id'}
      GROUP BY ${'device_kinds'}.${'id'}
      ORDER BY ${'device_kinds'}.${'id'}
      LIMIT ${db.param(length)}
      OFFSET ${db.param(offset)}
    `).run(dbPool);
  return {
    deviceKinds: deviceKinds.map(({ id, name, quantity, brand, manufacturer, image: { main_image, sub_images }, unit }) => ({ id, name, quantity, brand, manufacturer, mainImage: main_image, subImages: sub_images, unit })),
  };
});
