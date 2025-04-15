import * as db from 'zapatos/db';
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { BAD_REQUEST_CODE, NOT_FOUND_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import { getToken } from '#auth';
import jwt from 'jsonwebtoken';

const BodyDto = Type.Object({
  hmiCode: Type.String()
});

type BodyDto = Static<typeof BodyDto>;

export default defineEventHandler(async (event) => {
  try {
    const token = await getToken({ event });
    if (!token) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'You must be logged in to authenticate a device'
      });
    }

    const userId = token.id;
    
    const body = Value.Convert(BodyDto, await readBody(event));
    if (!Value.Check(BodyDto, body)) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: Invalid body'
      });
    }
    
    const { hmiCode } = body;

    if (!/^\d{6}$/.test(hmiCode)) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: Invalid HMI code format'
      });
    }
    
    const hmiCodeResult = await db.sql`
      SELECT code, status, expires_at 
      FROM hmi_codes 
      WHERE code = ${db.param(hmiCode)}
    `.run(dbPool);
    
    if (hmiCodeResult.length === 0) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: 'HMI code not found'
      });
    }
    
    const hmiCodeData = hmiCodeResult[0];
    
    if (new Date(hmiCodeData.expires_at) < new Date()) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'HMI code has expired'
      });
    }
    
    if (hmiCodeData.status !== 'pending') {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: `HMI code is not in pending status (current status: ${hmiCodeData.status})`
      });
    }
    
    const { JWT_SECRET } = useRuntimeConfig();
    const authToken = jwt.sign(
      { 
        id: userId,
        permissions: token.permissions,
        roles: token.roles
      }, 
      JWT_SECRET, 
      { expiresIn: '30d' }
    );
    
    await db.sql`
      UPDATE hmi_codes 
      SET 
        status = 'success', 
        user_id = ${db.param(userId)}, 
        auth_token = ${db.param(authToken)}, 
        updated_at = NOW() 
      WHERE code = ${db.param(hmiCode)}
    `.run(dbPool);
    
    return {
      success: true,
      message: 'Device authentication successful'
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    
    throw createError({
      statusCode: INTERNAL_SERVER_ERROR_CODE,
      message: 'Internal server error'
    });
  }
}); 