<script setup lang="ts">
import { facultyService } from '@/services';
const allFaculties = await facultyService.getAllFaculties();
const isDropdownActive = ref(false);
const dropdownItems = [...allFaculties, { name: 'Tất cả các khoa', id: null }];
const currentFacultyId = ref<null | string>(null);
const currentFacultyName = computed(() => dropdownItems.find(({ id }) => id === currentFacultyId.value)?.name || null);

function setFaculty (id: string) {
  currentFacultyId.value = id;
}

function toggleDropdown () {
  isDropdownActive.value = !isDropdownActive.value;
}

function closeDropdown () {
  isDropdownActive.value = false;
}
</script>

<template>
  <div class="relative pl-4 py-3 pr-8 rounded-md bg-white text-primary-light text-normal">
    <div class="cursor-pointer" @click="toggleDropdown">
      <div class="h-[100%] m-0 p-0" role="dropdown">
        <p class="line-clamp-1 text-ellipsis">{{ currentFacultyName }}</p>
      </div>
      <Icon
        aria-hidden
        class="absolute right-[16px] top-[16px] text-primary-dark text-md"
        :name="`${ !isDropdownActive ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up' }`"
      />
    </div>
    <div
      :class="`${ !isDropdownActive ? 'opacity-0 z-[-1]' : 'opacity-90 z-[60]' } animate-in animate-out fixed top-0 py-16 left-0 w-[100vw] h-[100vh] bg-black text-white`"
      tabindex="1"
      role="menu"
      @mouseenter="(e) => e.target.focus()"
      @keydown.esc="closeDropdown"
    />
  </div>
</template>
