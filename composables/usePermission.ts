export interface PermissionOptions {
  redirect?: boolean;
  redirectTo?: string;
}

export function usePermission () {
  const { data } = useAuth();

  const userId = computed(() => data.value?.user?.id);
  const userPermissions = computed(() => data.value?.user?.permissions || []);

  const hasPermission = (permission: string | string[]) => {
    if (!userPermissions.value) return false;

    if (Array.isArray(permission)) {
      return permission.every((p) => userPermissions.value.includes(p));
    }

    return userPermissions.value.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]) => {
    if (!userPermissions.value) return false;
    return permissions.some((p) => userPermissions.value.includes(p));
  };

  const requirePermission = (
    permission: string | string[],
    options: PermissionOptions = {
      redirect: true,
      redirectTo: '/unauthorized',
    },
  ) => {
    const hasRequired = hasPermission(permission);

    if (!hasRequired && options.redirect) {
      navigateTo(options.redirectTo || '/unauthorized');
    }

    return hasRequired;
  };

  const checkResourcePermission = (resource: string, action: string) => {
    return hasPermission(`${resource}:${action}`);
  };

  return {
    hasPermission,
    hasAnyPermission,
    requirePermission,
    checkResourcePermission,
    permissions: userPermissions,
    userId,
  };
}
