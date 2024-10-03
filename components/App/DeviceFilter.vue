<script setup lang="ts">
  import { facultyService, Faculty } from '@/services';

  const currentCategory = ref<null | Faculty>(null);
</script>

<template>
  <UDropdown>
    <div class="bg-white border-gray-lighter border-2 px-2 pr-7 relative">
      <button class="h-[100%] m-0 p-0">
        {{ currentCategory?.name || 'Tất cả các khoa' }}
      </button>
      <UIcon
        aria-hidden
        class="absolute right-1 top-2.5 text-gray-light text-xl"
        name="i-heroicons-chevron-down"
      />
    </div>
  </UDropdown>
</template>
