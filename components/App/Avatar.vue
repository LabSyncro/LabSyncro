<script setup lang="ts">
  import { userService } from '@/services';
  const avatar = ref<null| string>(null);
  onMounted(async () => { avatar.value = await userService.getAvatar(); });
</script>

<template>
  <div class="relative">
    <button
      class="h-9 w-9 rounded-full shadow-slate-dark shadow-sm absolute top-[-18px] right-[4px] lg:right-[16px]"
      role="button"
      aria-label="User Avatar"
    >
      <img
        class="h-[100%] aspect-auto inline-block" 
        :src="avatar || ''"
        alt="User's avatar"
      />
    </button>
  </div>
</template>
