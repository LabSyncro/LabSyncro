export default defineNuxtRouteMiddleware(async (to) => {
  const { status, data } = useAuth();

  if (!data.value?.user) {
    return navigateTo('/login');
  }

  if (status.value === 'authenticated') {
    const userPermissions = data.value.user.permissions;
    
    const normalizedPath = to.matched.map(route => {
      return route.path.replace(/:[^/]+/g, ':id');
    }).join('');
    const requiredPermission = `${normalizedPath}:edit`;

    if (requiredPermission && !userPermissions.includes(requiredPermission)) {
      return navigateTo('/unauthorized?error=PERMISSION_DENIED');
    }

    if (to.path === '/' && data.value.user.defaultRoute !== '/') {
      return navigateTo(data.value.user.defaultRoute);
    }
  }
});
