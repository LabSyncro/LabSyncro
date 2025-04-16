import * as db from 'zapatos/db';
import { BAD_REQUEST_CODE, NOT_FOUND_CODE, INTERNAL_SERVER_ERROR_CODE } from '~/constants';
import { dbPool } from '~/server/db';
import { Type, type Static } from '@sinclair/typebox';

const ResponseSuccessDto = Type.Object({
  status: Type.Literal('success'),
  token: Type.String(),
  lab: Type.Optional(Type.Object({
    id: Type.String(),
    name: Type.Optional(Type.String()),
    room: Type.Optional(Type.String()),
    branch: Type.Optional(Type.String())
  })),
  user: Type.Optional(Type.Object({
    id: Type.String(),
    email: Type.String(),
    name: Type.String(),
    roles: Type.Array(Type.Object({ name: Type.String(), key: Type.String() })),
    avatar: Type.String()
  }))
});

const ResponsePendingDto = Type.Object({
  status: Type.Literal('pending')
});

type ResponseSuccessDto = Static<typeof ResponseSuccessDto>;
type ResponsePendingDto = Static<typeof ResponsePendingDto>;

export default defineEventHandler(async (event) => {
  try {
    const hmiCode = getRouterParam(event, 'hmiCode');
    
    if (!hmiCode) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: HMI code is required'
      });
    }

    if (!/^\d{6}$/.test(hmiCode)) {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: 'Bad request: Invalid HMI code format'
      });
    }
    
    const hmiCodeResult = await db.sql`
      SELECT 
        hc.code, 
        hc.status, 
        hc.auth_token, 
        hc.expires_at, 
        hc.lab_id,
        l.name as lab_name, 
        l.room as lab_room, 
        l.branch as lab_branch,
        u.id as user_id, 
        u.name, 
        u.email,
        u.image as avatar,
        COALESCE(
          json_agg(
            json_build_object(
              'name', r.name,
              'key', r.key
            )
          ) FILTER (WHERE r.id IS NOT NULL),
          '[]'
        ) as roles
      FROM hmi_codes hc
      LEFT JOIN labs l ON hc.lab_id = l.id
      LEFT JOIN users u ON hc.user_id = u.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE hc.code = ${db.param(hmiCode)}
      GROUP BY 
        hc.code, 
        hc.status, 
        hc.auth_token, 
        hc.expires_at, 
        hc.lab_id,
        l.name, 
        l.room, 
        l.branch,
        u.id, 
        u.name, 
        u.email,
        u.image
    `.run(dbPool);
    
    if (hmiCodeResult.length === 0) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: 'HMI code not found or expired'
      });
    }
    
    const hmiCodeData = hmiCodeResult[0];
    
    if (new Date(hmiCodeData.expires_at) < new Date()) {
      throw createError({
        statusCode: NOT_FOUND_CODE,
        message: 'HMI code has expired'
      });
    }

    if (hmiCodeData.status === 'success' && hmiCodeData.auth_token) {
      const response: ResponseSuccessDto = {
        status: 'success',
        token: hmiCodeData.auth_token
      };

      if (hmiCodeData.lab_id) {
        response.lab = {
          id: hmiCodeData.lab_id,
          name: hmiCodeData.lab_name,
          room: hmiCodeData.lab_room,
          branch: hmiCodeData.lab_branch
        };

        await db.sql`
          UPDATE hmi_codes 
          SET status = 'used', updated_at = NOW() 
          WHERE code = ${db.param(hmiCode)}
        `.run(dbPool);
      }

      if (hmiCodeData.user_id) {
        response.user = {
          id: hmiCodeData.user_id,
          name: hmiCodeData.name,
          email: hmiCodeData.email,
          avatar: hmiCodeData.avatar,
          roles: hmiCodeData.roles
        };
      }
      
      return response;
    } else if (hmiCodeData.status === 'pending') {
      const response: ResponsePendingDto = {
        status: 'pending'
      };
      
      return response;
    } else {
      throw createError({
        statusCode: BAD_REQUEST_CODE,
        message: `Authentication error: ${hmiCodeData.status}`
      });
    }
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