<script setup lang="ts">
</script>

<template>
  <div>
    <div class="bg-primary-darker px-14 py-9 lg:px-32" role="banner">
      <div class="flex md:hidden mb-10 justify-between items-center">
        <AppLogo />
        <AppAvatar />
      </div>
      <div class="flex gap-16 justify-between">
        <div class="grow-[1] hidden md:flex items-center">
          <AppLogo />
        </div>
        <div class="flex items-stretch justify-between gap-4 grow-[3]">
          <AppDeviceFilter class="h-11" />
          <AppSearchBox class="flex-1" />
          <AppQrButton />
        </div>
        <div class="my-auto hidden md:flex grow-[2] gap-3 justify-end">
          <AppAvatar />
        </div>
      </div>
    </div>
    <AppNavBar />
  </div>
</template>
