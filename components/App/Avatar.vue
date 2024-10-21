<script setup lang="ts">
import { userService } from '@/services';
const avatar = ref<null| string>(null);
onMounted(async () => { avatar.value = await userService.getAvatar(); });
</script>

<template>
  <div class="relative">
    <button
      class="h-9 w-9 rounded-full border-slate-dark border-[2px] absolute top-[-18px] right-[4px] lg:right-[16px] bg-primary-lighter"
      role="button"
      aria-label="User Avatar"
    >
      <img
        class="h-[100%] aspect-auto inline-block" 
        :src="avatar || ''"
        alt="User's avatar"
      >
      <div
        class="w-3 h-3 absolute bg-safe-darker rounded-full z-50 border-white border-[2px] top-6 right-[-2px]"
        aria-hidden
      />
    </button> 
  </div>
</template>
