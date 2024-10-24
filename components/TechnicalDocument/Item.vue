<script setup lang="ts">
const props = defineProps<{
  departmentName: string;
  title: string;
  summary: string;
}>();
</script>

<template>
  <div class="bg-white flex flex-col p-3 border-[1px] border-tertiary-dark h-[300px]">
    <p class="font-semibold text-primary-lighter text-sm">{{ props.departmentName.toUpperCase() }}</p>
    <h3 class="text-tertiary-darker text-normal line-clamp-2 mt-2">{{ props.title }}</h3>
    <p class="text-sm text-gray-light mt-6 line-clamp-6 text-justify">{{ props.summary }}</p>
  </div>
</template>
