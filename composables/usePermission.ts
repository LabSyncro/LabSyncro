export interface PermissionOptions {
  redirect?: boolean;
  redirectTo?: string;
  error?: string;
}

export function usePermission() {
  const { data } = useAuth();
  const router = useRouter();

  const userId = computed(() => data.value?.user?.id);
  const userPermissions = computed(() => data.value?.user?.permissions || []);
  const userRoles = computed(() => data.value?.user?.roles || []);

  /**
   * Checks if user has all specified permissions
   */
  const hasPermission = (permission: string | string[]) => {
    if (!userPermissions.value) return false;

    if (Array.isArray(permission)) {
      return permission.every((p) => {
        // Handle both formats: "resource:action" and "resource-action"
        const normalizedPerm = p.includes(':') ? p : p.replace('-', ':');
        return userPermissions.value.includes(normalizedPerm);
      });
    }

    // Handle both formats: "resource:action" and "resource-action"
    const normalizedPerm = permission.includes(':') ? permission : permission.replace('-', ':');
    return userPermissions.value.includes(normalizedPerm);
  };

  /**
   * Checks if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]) => {
    if (!userPermissions.value) return false;
    return permissions.some((p) => {
      const normalizedPerm = p.includes(':') ? p : p.replace('-', ':');
      return userPermissions.value.includes(normalizedPerm);
    });
  };

  /**
   * Checks if user has permission and redirects if not
   */
  const requirePermission = (
    permission: string | string[],
    options: PermissionOptions = {
      redirect: true,
      redirectTo: '/unauthorized',
      error: 'PERMISSION_DENIED'
    },
  ) => {
    const hasRequired = hasPermission(permission);

    if (!hasRequired && options.redirect) {
      const query = options.error ? { error: options.error } : undefined;
      router.push({
        path: options.redirectTo || '/unauthorized',
        query
      });
    }

    return hasRequired;
  };

  /**
   * Checks if user has specific resource:action permission
   */
  const checkResourcePermission = (resource: string, action: string) => {
    return hasPermission(`${resource}:${action}`);
  };

  /**
   * Checks if user has any of the specified roles
   */
  const hasRole = (roleKey: string | string[]) => {
    if (!userRoles.value) return false;

    if (Array.isArray(roleKey)) {
      return roleKey.some(key => 
        userRoles.value.some(role => role.key === key)
      );
    }

    return userRoles.value.some(role => role.key === roleKey);
  };

  /**
   * Checks if user has all specified roles
   */
  const hasAllRoles = (roleKeys: string[]) => {
    if (!userRoles.value) return false;
    return roleKeys.every(key => 
      userRoles.value.some(role => role.key === key)
    );
  };

  return {
    hasPermission,
    hasAnyPermission,
    requirePermission,
    checkResourcePermission,
    hasRole,
    hasAllRoles,
    permissions: userPermissions,
    roles: userRoles,
    userId,
  };
}
