<script setup lang="ts">
</script>

<template>
  <div
    class="bg-white px-14 py-10 lg:px-32"
    role="banner"
  >
    <div class="flex gap-16 justify-between">
      <div class="grow-[1] flex items-center">
        <AppLogo class="aspect-auto w-48" />
      </div>
      <div class="flex items-stretch justify-between gap-4 grow-[3]">
        <AppDeviceFilter class="w-[120px] w-[180px] lg:w-[280px]" /> 
        <AppSearchBox class="flex-1" />
      </div>
      <div class="flex my-auto grow-[2] gap-3 justify-end">
        <AppAvatar />
        <AppShoppingButton />
      </div>
    </div>
    <nav/>
  </div>
</template>
