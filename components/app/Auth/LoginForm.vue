<script setup lang="ts">
const { signIn } = useAuth();;

const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  await signIn('credentials', {
    email: email.value,
    password: password.value,
    callbackUrl: '/'
  });
};
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
      <input
id="email" v-model="email" type="email" required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" >
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
      <input
id="password" v-model="password" type="password" required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50" >
    </div>
    <Button type="submit" class="w-full bg-blue-500 hover:bg-blue-600">Sign in with Email</Button>
  </form>
</template>
