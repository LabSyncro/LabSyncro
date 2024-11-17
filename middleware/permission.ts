export default defineNuxtRouteMiddleware(async (to) => {
  const { data } = useAuth();

  if (!data.value?.user) {
    return navigateTo('/login');
  }

  const requiredPermission = to.meta.permission as string;
  if (!requiredPermission) return;

  const userPermissions = data.value.user.permissions || [];
  if (!userPermissions.includes(requiredPermission)) {
    return navigateTo('/unauthorized');
  }
});
