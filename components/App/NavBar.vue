<script setup lang="ts">
const productBtnRef = useTemplateRef('productBtn');
const { isActive: isDropdownActive } = useClick(productBtnRef);
</script>
<template>
  <nav class="bg-tertiary-darker flex pl-32 text-white items-stretch">
    <button ref="productBtn"
      :class="`relative h-16 px-8 pr-14 hover:bg-primary-darker ${isDropdownActive ? 'bg-primary-darker' : ''}`">
      Sản phẩm
      <Icon aria-hidden class="absolute text-white text-md top-[26px] right-[26px]"
        :name="`${!isDropdownActive ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up'}`" />
    </button>
    <AppProductDropdown :active="isDropdownActive" />
    <button class="cursor-pointer h-16 px-5 hover:bg-primary-darker"> Phòng thí nghiệm </button>
    <button class="cursor-pointer h-16 px-5 hover:bg-primary-darker"> Bài viết </button>
    <button class="cursor-pointer h-16 px-5 hover:bg-primary-darker"> Quy định </button>
    <button class="cursor-pointer h-16 px-5 hover:bg-primary-darker"> Liên hệ </button>
  </nav>
</template>
