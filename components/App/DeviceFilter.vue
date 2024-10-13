<script setup lang="ts">
  import { facultyService, Faculty } from '@/services';
  const allFaculties = await facultyService.getAllFaculties();
  const { isActive: isDropdownActive } = useClick('dropdown');
  const dropdownItems = [...allFaculties, { name: 'Tất cả các khoa', id: null }];
  const currentFacultyId = ref<null | string>(null);
  const currentFacultyName = computed(() => dropdownItems.find(({ id }) => id === currentFacultyId.value)?.name || null);
</script>

<template>
  <div class="relative pl-4 py-3 rounded-lg group bg-white text-primary-light" ref="dropdown">
    <div class="h-[100%] m-0 p-0" role="dropdown">
      <div class="h-[100%] w-[100%] flex items-center">{{ currentFacultyName }}</div>
      <ul
        :class="`
          absolute top-[56px] left-[-2px]
          min-w-56 z-50
          border-2 border-tertiary-lighter
          ${ !isDropdownActive ? 'hidden' : 'block' }
        `"
      >
        <li
          v-for="item in dropdownItems"
          :key="item.id"
          :class="`px-2 py-2 ${ item.id === currentFacultyId ? 'bg-slate-light' : '' } hover:bg-slate-light`"
          @click="() => currentFacultyId = item.id"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <Icon
      aria-hidden
      class="absolute right-[16px] top-[16px] text-primary-dark text-md"
      name="i-heroicons-chevron-down"
    />
  </div>
</template>
