<script setup lang="ts">
const { signIn } = useAuth();

const handleLogin = async () => {
  await signIn('google', { callbackUrl: '/' });
};
</script>

<template>
  <Button class="w-full flex justify-center items-center bg-blue-100 hover:bg-blue-200" @click="handleLogin">
    <img class="h-5 w-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo">
    Sign in with Google
  </Button>
</template>
