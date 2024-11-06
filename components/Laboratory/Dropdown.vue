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

function toggleDropdown() {
  isDropdownActive.value = !isDropdownActive.value;
}
</script>

<template>
  <div class="relative">
    <button class="relative text-left text-normal p-2.5 py-3 border-[1px] w-[100%] shadow-sm" @click="toggleDropdown">
      <p class="line-clamp-1">{{ props.lab.name }}</p>
      <Icon
        aria-hidden class="absolute top-4 right-2"
        :name="`${isDropdownActive ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'}`" />
    </button>
    <div v-if="isDropdownActive" class="my-1 absolute px-2.5 py-1 bg-white z-50 w-[100%] shadow-md">
      <p class="text-sm font-bold text-slate-dark my-2">GIỜ MỞ CỬA (Dự kiến)</p>
      <div v-for="[day, times] in Object.entries(props.lab.timetable)" :key="day" class="flex gap-1 text-sm">
        <p>{{ day }}:</p>
        <div>
          <p v-for="time in times" :key="time">{{ time }}</p>
        </div>
      </div>
      <p class="text-sm font-bold text-slate-dark my-2">LIÊN HỆ:</p>
    </div>
  </div>
</template>
