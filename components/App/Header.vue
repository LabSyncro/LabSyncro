<script setup lang="ts">
</script>

<template>
  <div
    class="bg-primary-darker px-14 py-6 lg:px-32"
    role="banner"
  >
    <div class="flex gap-16 justify-between">
      <div class="grow-[1] flex items-center">
        <AppLogo class="w-[240px]" />
      </div>
      <div class="flex items-stretch justify-between gap-4 grow-[3]">
        <AppDeviceFilter class="w-[180px] h-11" /> 
        <AppSearchBox class="flex-1" />
      </div>
      <div class="flex my-auto grow-[2] gap-3 justify-end">
        <AppAvatar />
        <AppShoppingButton />
      </div>
    </div>
    <nav>
    </nav>
  </div>
</template>
