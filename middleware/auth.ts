export default defineNuxtRouteMiddleware(async (to) => {
  const { status } = useAuth();

  if (status.value === 'unauthenticated' && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (status.value === 'authenticated' && to.path === '/login') {
    return navigateTo('/');
  }
});
