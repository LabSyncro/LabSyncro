<script setup lang="ts">
const searchText = ref('');

const isDropdownActive = ref(false);

function openDropdown () {
  isDropdownActive.value = true;
}

function closeDropdown () {
  isDropdownActive.value = false;
}

async function handleClickOutsideOfSearchBox () {
  setTimeout(closeDropdown, 300);
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <input v-model="searchText"
        class="bg-white text-primary-light placeholder:text-primary-light border-2 h-11 w-[100%] pl-10 pr-3 rounded-md text-md placeholder:text-normal"
        type="search" placeholder="Tên loại thiết bị" @focus="openDropdown" @blur="handleClickOutsideOfSearchBox">
      <Icon aria-hidden class="absolute left-3 top-[12px] text-xl text-primary-dark"
        name="i-heroicons-magnifying-glass" />
    </div>

    <div :class="`${isDropdownActive ? 'flex' : 'hidden'} flex-col gap-1 absolute bg-white p-1 mt-1 w-[100%]`">
      <NuxtLink class="flex gap-1 justify-between items-center py-1 px-2 rounded-md bg-primary-darker text-white"
        href="/devices">
        <p> Xem toàn bộ thiết bị </p>
        <Icon aria-hidden name="i-heroicons-chevron-double-right" class="text-lg" />
      </NuxtLink>
    </div>
  </div>
</template>
