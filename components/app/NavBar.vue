<script setup lang="ts">
const { hasPermission } = usePermission();
</script>

<template>
  <nav
    class="bg-tertiary-darker flex justify-center md:justify-start md:pl-28 text-white items-stretch text-normal md:text-lg"
  >
    <NuxtLink
      class="flex items-center cursor-pointer h-16 px-2 sm:px-5 hover:bg-primary-darker"
      href="/devices"
    >
      Thiết bị
    </NuxtLink>
    <NuxtLink
      v-if="hasPermission('/admin/labs:own')"
      class="flex items-center cursor-pointer h-16 px-2 sm:px-5 hover:bg-primary-darker"
      href="/admin/labs"
    >
      Phòng thí nghiệm
    </NuxtLink>
    <NuxtLink
      v-if="hasPermission('/borrow-return:edit')"
      class="flex items-center cursor-pointer h-16 px-2 sm:px-5 hover:bg-primary-darker"
      href="/borrow-return"
    >
      Mượn / Trả thiết bị
    </NuxtLink>
    <button class="cursor-pointer h-16 px-2.5 sm:px-5 hover:bg-primary-darker">
      Bài viết
    </button>
    <button class="cursor-pointer h-16 px-2.5 sm:px-5 hover:bg-primary-darker">
      Quy định
    </button>
    <button class="cursor-pointer h-16 px-2.5 sm:px-5 hover:bg-primary-darker">
      Liên hệ
    </button>
  </nav>
</template>
