<script setup lang="ts">
  import { facultyService, Faculty } from '@/services';
  const allFaculties = await facultyService.getAllFaculties();
  const { isActive: isDropdownActive } = useClick('dropdown');
  const dropdownItems = [...allFaculties, { name: 'Tất cả các khoa', id: null }];
  const currentFacultyId = ref<null | string>(null);
  const currentFacultyName = computed(() => dropdownItems.find(({ id }) => id === currentFacultyId.value)?.name || null);
</script>

<template>
  <div class="relative border-tertiary-lighter border-2 px-5 py-2 pr-8 group" ref="dropdown">
    <div class="h-[100%] m-0 p-0" role="dropdown">
      <span>{{ currentFacultyName }}</span>
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
          :class="`px-2 py-2 ${ item.id === currentFacultyId ? 'bg-slate-light' : '' }`"
          @click="() => currentFacultyId = item.id"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <Icon
      aria-hidden
      class="absolute right-1.5 top-3.5 text-gray-light text-lg"
      :name="`${ isDropdownActive ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down' }`"
    />
  </div>
</template>
