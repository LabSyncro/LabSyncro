<script setup lang="ts">
import { facultyService } from '@/services';
const allFaculties = await facultyService.getAllFaculties();
const selectedFacultyId = ref(null);
const hoveredFacultyId = ref(null);

function onSelectedFaculty (id: number) {
  selectedFacultyId.value = id;
}

function onHoveredFaculty (id: number) {
  hoveredFacultyId.value = id;
}

function onMouseoutFaculty (id: number) {
  if (hoveredFacultyId.value === id) hoveredFacultyId.value = null;
}

const curFaculty = computed(() => {
  const index = hoveredFacultyId.value ?? selectedFacultyId.value;
  if (index === null) return null;
  return allFaculties[index];
});

</script>

<template>
  <section class="bg-gray-100 py-16">
    <div class="flex">
      <div class="relative bg-white py-5 pl-12 pr-2 lg:pl-24 flex flex-col shadow-[0_0_24px_rgba(0,0,0,0.2)]">
        <a
          v-for="(faculty, index) in allFaculties"
          :key="index"
          class="relative inline-block text-sm my-2 cursor-pointer rounded-md hover:bg-secondary-dark p-1 pl-2 pr-8"
          @mouseenter="onHoveredFaculty(index)"
          @click="onSelectedFaculty(index)"
          @mouseout="onMouseoutFaculty(index)"
        >
          {{ faculty.name }}
          <Icon
            v-if="index === selectedFacultyId"
            aria-hidden
            class="absolute top-[8px] right-[6px]"
            name="i-heroicons-check"
          />
        </a>
      </div>
      <div class="bg-white flex-1 my-5 px-5 py-5 pl-12">
        <h2 class="text-xl">Phòng thí nghiệm</h2>
        <div v-if="curFaculty" class="relative">
          <h3
            class="border-tertiary-lighter flex items-center border-b-[1px] font-semibold text-tertiary-dark mb-8 pb-1 text-normal mt-3">
            <span>
              {{ curFaculty.name }}
            </span>
            <Icon
              aria-hidden
              class="ml-5"
              name="i-heroicons-chevron-double-right"
            />
          </h3>
        </div>
      </div>
    </div>
  </section>
</template>
