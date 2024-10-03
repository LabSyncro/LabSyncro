<script setup lang="ts">
  import { facultyService, Faculty } from '@/services';
  const allFaculties = await facultyService.getAllFaculties();
  const items = [
    {
      label: "Tất cả các khoa",
    },
    ...allFaculties.map((fa) => ({ label: fa })),
  ];

  const currentFaculty = ref<null | Faculty>(null);  
</script>

<template>
  <UDropdown
    :popper="{ placement: 'bottom-start' }"
    :items="items"
  >
    <div class="bg-white border-gray-lighter border-2 px-5 py-2 pr-8 relative">
      <button class="h-[100%] m-0 p-0 font-[500]">
        {{ currentFaculty?.name || 'Tất cả các khoa' }}
      </button>
      <UIcon
        aria-hidden
        class="absolute right-1.5 top-3.5 text-gray-light text-lg"
        name="i-heroicons-chevron-down"
      />
    </div>
  </UDropdown>
</template>
