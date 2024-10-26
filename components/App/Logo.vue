<script setup lang="ts">
const router = useRouter();

const navigateToHome = () => {
  router.push('/');
}
</script>

<template>
  <NuxtImg src="/images/logo.png" class="cursor-pointer" @click="navigateToHome" />
</template>
