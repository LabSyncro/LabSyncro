<script setup lang="ts">
const { data, signIn } = useAuth();
const route = useRoute();

const hmiCode = computed(() => route.query.hmiCode as string | undefined);
const defaultRoute = computed(() => data.value?.user?.defaultRoute || "/");

const handleLogin = async () => {
  let callbackUrl =
    (route.query.callbackUrl as string | undefined) || defaultRoute.value;

  if (hmiCode.value && !route.query.callbackUrl) {
    callbackUrl = `/auth/hmi?hmiCode=${hmiCode.value}`;
  }

  try {
    await signIn("google", {
      callbackUrl: callbackUrl,
      redirect: true,
    });
  } catch (err) {
    showError({ statusCode: 401, statusMessage: "Authentication failed" });
  }
};
</script>

<template>
  <button
    @click="handleLogin"
    class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tertiary-darker transition-colors"
  >
    <img
      class="h-5 w-5"
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="Google logo"
    />
    <span>Sign in with Google</span>
  </button>
</template>
