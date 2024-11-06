<script setup lang="ts">
const props = defineProps<{
  lab: {
    name: string;
    branch: string;
    timetable: Record<string, string[]>
    adminId: string;
    name: string;
    room: string;
  };
}>();
const isDropdownActive = ref(false);
</script>

<template>
  <div>
    <button class="relative text-left text-normal p-2.5 py-3 border-[1px] w-[100%] shadow-sm">
      <p class="line-clamp-1">{{ props.lab.name }}</p>
      <Icon
        aria-hidden class="absolute top-4 right-2"
        :name="`${isDropdownActive ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'}`" />
    </button>
  </div>
</template>
