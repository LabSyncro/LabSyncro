import { getToken } from '#auth';
import { H3Event } from 'h3';
import { FORBIDDEN_CODE } from '~/constants';

export async function requirePermission(event: H3Event, requiredPermission: string | string[]) {
  const token = await getToken({ event });
  const userPermissions = token?.permissions as string[] || [];

  const hasPermission = Array.isArray(requiredPermission)
    ? requiredPermission.every(p => userPermissions.includes(p))
    : userPermissions.includes(requiredPermission);

  if (!hasPermission) {
    throw createError({
      statusCode: FORBIDDEN_CODE,
      message: 'Forbidden: Insufficient permissions',
    });
  }
} 