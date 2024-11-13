<script setup lang="ts">
const dropdownRef = useTemplateRef('dropdown');
const { isActive: isDropdownActive } = useClick(dropdownRef);
function toggleDropdown (event: Event) {
  event.stopPropagation();
  isDropdownActive.value = !isDropdownActive.value;
}
</script>
<template>
  <nav class="bg-tertiary-darker flex md:pl-32 text-white items-stretch text-normal md:text-lg">
    <div ref="dropdown">
      <button
        :class="`relative h-16 px-8 pr-14 hover:bg-primary-darker ${isDropdownActive ? 'bg-primary-darker' : ''}`" @click="toggleDropdown">
        Sản phẩm
        <Icon aria-hidden class="absolute text-white text-md top-[26px] right-[26px]"
          :name="`${!isDropdownActive ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up'}`" />
      </button>
      <AppProductDropdown :active="isDropdownActive" />
    </div>
    <button class="cursor-pointer h-16 px-3 hover:bg-primary-darker"> Phòng thí nghiệm </button>
    <button class="cursor-pointer h-16 px-3 hover:bg-primary-darker"> Tài liệu </button>
    <button class="cursor-pointer h-16 px-3 hover:bg-primary-darker"> Liên hệ </button>
  </nav>
</template>
