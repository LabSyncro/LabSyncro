import * as db from 'zapatos/db';
import {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
} from '~/constants';
import { dbPool } from '~/server/db';
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { DeviceCheckerResourceDto } from '~/lib/api_schema';
import { getToken } from '#auth';

const BodyDto = Type.Object({
  lab_id: Type.String(),
});
type BodyDto = Static<typeof BodyDto>;

export default defineEventHandler<Promise<DeviceCheckerResourceDto>>(
  async (event) => {
    const body = Value.Convert(BodyDto, await readBody(event));
    if (!Value.Check(BodyDto, body)) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: Invalid body',
      });
    }

    const deviceId = Value.Convert(Type.String(), getRouterParam(event, 'id'));
    const token = await getToken({ event });
    const userId = token?.id;
    let returnedDevice;

    const deviceExists = await db.sql`
      SELECT EXISTS (
        SELECT 1 
        FROM ${'devices'} 
        WHERE ${'id'} = ${db.param(deviceId)}
        AND ${'deleted_at'} IS NULL
      ) AS device_exists;
    `.run(dbPool);

    if (!deviceExists[0].device_exists) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: 'Device not found',
      });
    }

    const isDeviceInLab = await db.sql`
      SELECT EXISTS (
        SELECT 1 
        FROM ${'devices'} d
        JOIN ${'labs'} l ON d.${'lab_id'} = l.${'id'}
        WHERE 
          d.${'id'} = ${db.param(deviceId)}
          AND l.${'admin_id'} = ${db.param(userId)}
          AND d.${'lab_id'} = ${db.param(body.lab_id)}
      ) AS is_device_in_lab;
    `.run(dbPool);

    if (!isDeviceInLab[0].is_device_in_lab) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'This device does not belong to your lab',
      });
    }

    const [device] = await db.sql`
      SELECT 
        d.${'id'}, 
        d.${'status'},
        dk.${'allowed_borrow_roles'} 
      FROM ${'receipts_devices'} rd
      JOIN ${'devices'} d ON d.id = rd.${'device_id'}
      JOIN ${'device_kinds'} dk ON dk.id = d.${'kind'}
      WHERE 
        rd.${'device_id'} = ${db.param(deviceId)}
        AND d.${'status'} = 'borrowing'
        AND d.${'lab_id'} = ${db.param(body.lab_id)}
      ORDER BY 
        rd.${'created_at'} DESC
      LIMIT 1;  
    `.run(dbPool);

    if (!device) {
      returnedDevice = await db.sql`
        SELECT 
          d.${'id'}, 
          d.${'status'},
          dk.${'allowed_borrow_roles'} 
        FROM ${'devices'} d
        JOIN ${'device_kinds'} dk ON dk.id = d.${'kind'}
        JOIN ${'labs'} l ON d.${'lab_id'} = l.${'id'}
        WHERE 
          d.${'id'} = ${db.param(deviceId)}
          AND l.${'admin_id'} = ${db.param(userId)}
          AND d.${'lab_id'} = ${db.param(body.lab_id)}
        LIMIT 1;
      `.run(dbPool);

      if (returnedDevice.length === 0) {
        throw createError({
          statusCode: BAD_REQUEST_CODE,
          message: 'This device does not belong to your lab',
        });
      }

      

      return {
        id: returnedDevice[0].id,
        status: returnedDevice[0].status,
        allowedBorrowRoles: returnedDevice[0].allowed_borrow_roles,
      };
    }

    const output = {
      id: device.id,
      status: device.status,
      allowedBorrowRoles: device.allowed_borrow_roles,
    };

    if (!Value.Check(DeviceCheckerResourceDto, output)) {
      throw createError({
        statusCode: INTERNAL_SERVER_ERROR_CODE,
        message:
          'Internal server error: the returned output does not conform to the schema',
      });
    }

    return output;
  },
);
