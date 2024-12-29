export default defineNuxtRouteMiddleware(async (to) => {
  const { status, data } = useAuth();

  if (!data.value?.user) {
    return navigateTo('/login');
  }

  if (status.value === 'authenticated') {
    const userPermissions = data.value.user.permissions;
    
    const requiredPermission = `${to.path}:own`;

    if (requiredPermission && !userPermissions.includes(requiredPermission)) {
      return navigateTo('/unauthorized?error=PERMISSION_DENIED');
    }

    if (to.path === '/' && data.value.user.defaultRoute !== '/') {
      return navigateTo(data.value.user.defaultRoute);
    }
  }
});
