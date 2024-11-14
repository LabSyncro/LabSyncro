<script setup lang="ts">
const dropdownRef = useTemplateRef('dropdown');
const { isActive: isDropdownActive } = useClick(dropdownRef);
function toggleDropdown (event: Event) {
  event.stopPropagation();
  isDropdownActive.value = !isDropdownActive.value;
}
</script>
<template>
  <nav class="bg-tertiary-darker flex justify-center sm:justify-start md:pl-28 text-white items-stretch text-normal md:text-lg">
    <div ref="dropdown">
      <button
        :class="`relative h-16 px-2 sm:px-8 pr-8 sm:pr-10 hover:bg-primary-darker ${isDropdownActive ? 'bg-primary-darker' : ''}`" @click="toggleDropdown">
        Sản phẩm
        <Icon aria-hidden class="absolute text-white text-sm sm:text-md top-[27px] sm:top-[26px] right-[10px]"
          :name="`${!isDropdownActive ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up'}`" />
      </button>
      <AppProductDropdown :active="isDropdownActive" />
    </div>
    <button class="cursor-pointer h-16 px-2 sm:px-5 hover:bg-primary-darker"> Phòng thí nghiệm </button>
    <button class="cursor-pointer h-16 px-2.5 sm:px-5 hover:bg-primary-darker"> Bài viết </button>
    <button class="cursor-pointer h-16 px-2.5 sm:px-5 hover:bg-primary-darker"> Quy định </button>
    <button class="cursor-pointer h-16 px-2.5 sm:px-5 hover:bg-primary-darker"> Liên hệ </button>
  </nav>
</template>
