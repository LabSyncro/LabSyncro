<script setup lang="ts">
import { facultyService } from '@/services';
const allFaculties = await facultyService.getAllFaculties();
const dropdownRef = useTemplateRef('dropdown');
const { isActive: isDropdownActive } = useClick(dropdownRef);
const dropdownItems = [...allFaculties, { name: 'Tất cả các khoa', id: null }];
const currentFacultyId = ref<null | string>(null);
const currentFacultyName = computed(() => dropdownItems.find(({ id }) => id === currentFacultyId.value)?.name || null);

function setFaculty(id: string | null) {
  currentFacultyId.value = id;
}

function toggleDropdown(event: Event) {
  event.stopPropagation();
  isDropdownActive.value = !isDropdownActive.value;
}

function closeDropdown(event: Event) {
  event.stopPropagation();
  isDropdownActive.value = false;
}
</script>

<template>
  <div
ref="dropdown"
    :class="`${!isDropdownActive ? 'bg-white' : 'bg-slate-lighter'} relative rounded-md text-primary-light text-normal`">
    <div class="cursor-pointer pl-4 py-3 pr-8 " @click="toggleDropdown">
      <div class="h-[100%] m-0 p-0" role="dropdown">
        <p class="line-clamp-1 text-ellipsis">{{ currentFacultyName }}</p>
      </div>
      <Icon
aria-hidden class="absolute right-[10px] top-[16px] text-primary-dark text-md"
        :name="`${!isDropdownActive ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up'}`" />
    </div>
    <div
      :class="`${!isDropdownActive ? 'opacity-0 z-[-1]' : 'opacity-100 z-[60]'} animate-in animate-out absolute bg-white top-12 outline-none text-sm w-[250px]`"
      tabindex="1" role="menu" @mouseenter="(e) => e.target.focus()" @keydown.esc="closeDropdown">
      <p class="px-2 py-2 bg-slate-light border-b-[1px]">Tìm tên khoa</p>
      <div class="flex flex-col items-stretch mb-2 mt-1">
        <button
          :class="`${currentFacultyId === null ? 'bg-secondary-dark' : ''} relative mx-1 my-0.5 px-1 py-1 hover:bg-secondary-dark text-left rounded-sm`"
          @click="(event) => { setFaculty(null); closeDropdown(event) }">
          Tất cả các khoa
          <Icon
v-if="currentFacultyId === null" aria-hidden class="absolute top-[8px] right-[6px]"
            name="i-heroicons-check" />
        </button>
        <button
v-for="faculty in allFaculties" :key="faculty.id"
          :class="`${currentFacultyId === faculty.id ? 'bg-secondary-dark' : ''} relative mx-1 my-0.5 px-1 py-1 text-black hover:bg-secondary-dark text-left rounded-sm line-clamp-1`"
          @click="(event) => { setFaculty(faculty.id); closeDropdown(event) }">
          {{ faculty.name }}
          <Icon
v-if="currentFacultyId === faculty.id" aria-hidden class="absolute top-[8px] right-[6px]"
            name="i-heroicons-check" />
        </button>
      </div>
    </div>
  </div>
</template>
