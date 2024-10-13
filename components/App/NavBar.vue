<script setup lang="ts">
  const isDropdownActive = ref(false);

  function toggleActive () {
    isDropdownActive.value = !isDropdownActive.value;
  }
</script>
<template>
  <nav class="bg-tertiary-darker flex justify-center text-white items-stretch">
    <button
      class="relative h-16 px-8 pr-14 hover:bg-primary-darker"
      @click="toggleActive"
    >
      Sản phẩm
      <Icon
        aria-hidden
        class="absolute text-white text-md top-[26px] right-[26px]"
        :name="`${ !isDropdownActive ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-up' }`"
      />
      <AppProductModal :active="isDropdownActive" />
    </button>
    <button class="cursor-pointer h-16 px-5 hover:bg-primary-darker"> Phòng thí nghiệm </button>
    <button class="cursor-pointer h-16 px-5 hover:bg-primary-darker"> Bài viết </button>
    <button class="cursor-pointer h-16 px-5 hover:bg-primary-darker"> Quy định </button>
    <button class="cursor-pointer h-16 px-5 hover:bg-primary-darker"> Liên hệ </button>
  </nav>
</template>
