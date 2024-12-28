export default defineNuxtRouteMiddleware(async (to) => {
  const { status, data } = useAuth();

  if (!data.value?.user) {
    return navigateTo('/login');
  }

  if (status.value === 'authenticated') {
    const requiredPermission = to.meta.permission as string;
    if (requiredPermission && !data.value?.user?.permissions?.includes(requiredPermission)) {
      return navigateTo('/unauthorized?error=PERMISSION_DENIED');
    }
  }
});
