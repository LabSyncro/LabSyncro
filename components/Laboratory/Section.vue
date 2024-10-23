<script setup lang="ts">
import { facultyService, Faculty } from '@/services';
const allFaculties = await facultyService.getAllFaculties();
</script>

<template>
  <section class="bg-gray-200 py-6">
    <div class="flex">
      <div class="relative bg-white py-5 pl-12 pr-8 lg:pl-24 lg:pr-16 flex flex-col shadow-[0_0_24px_rgba(0,0,0,0.2)]">
        <a
          v-for="(faculty, index) in allFaculties"
          :key="index"
          class="text-sm my-2"
        >
          {{ faculty.name }}
        </a>
      </div>
      <div class="bg-white flex-1 my-5 px-5 py-5">
      </div>
    </div>
  </section>
</template>
