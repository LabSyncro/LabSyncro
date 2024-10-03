<script setup lang="ts">
  import { facultyService, Faculty } from '@/services';
  const allFaculties = await facultyService.getAllFaculties();
  const currentFaculty = ref<null | Faculty>(null);  
</script>

<template>
  <div class="relative">
    <DropdownMenu>
      <DropdownMenuTrigger
        as-child
        class="border-gray-lighter border-2 px-5 py-2 pr-8"
      >
        <button class="h-[100%] m-0 p-0 font-[500]">
          {{ currentFaculty?.name || 'Tất cả các khoa' }}
        </button>
        <Icon
          aria-hidden
          class="absolute right-1.5 top-3.5 text-gray-light text-lg"
          name="i-heroicons-chevron-down"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuLabel>Tìm thiết bị theo khoa</DropdownMenuLabel>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
