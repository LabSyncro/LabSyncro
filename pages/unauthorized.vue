<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Unauthorized Access
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          You don't have permission to access this resource
        </p>
      </div>
      <div class="mt-8">
        <Button class="w-full" @click="$router.push('/')">
          Return to Dashboard
        </Button>
      </div>
    </div>
  </div>
</template>
