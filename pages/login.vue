<script lang="ts" setup>
definePageMeta({
  layout: 'auth',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  }
});
</script>

<template>
  <div class="md:min-h-screen flex items-center justify-center bg-gray-200 p-0 md:p-4">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
      <div class="space-y-2">
        <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900">
          Welcome to LabSyncro
        </h2>
        <p class="text-center text-sm text-gray-500">
          Sign in with your HCMUT account to continue
        </p>
      </div>

      <div class="pt-4">
        <AuthLoginButton />
      </div>

      <div class="mt-4 text-center text-xs text-gray-500">
        By signing in, you agree to our
        <a href="#" class="text-tertiary-darker hover:underline">Terms of Service</a>
        and
        <a href="#" class="text-tertiary-darker hover:underline">Privacy Policy</a>
      </div>
    </div>
  </div>
</template>
