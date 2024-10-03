<script setup lang="ts">
  import { userService } from '@/services';
  const avatar = ref<null| string>(null);
  onMounted(async () => { avatar.value = await userService.getAvatar(); });
</script>

<template>
  <button role="button" aria-label="User Avatar">
    <img
      class="rounded-lg inline-block" 
      :src="avatar || ''"
      alt="User's avatar"
    />
  </button>
</template>
