<script setup lang="ts">
</script>

<template>
  <div>
    <div class="bg-primary-darker px-14 py-9 lg:px-32" role="banner">
      <div class="flex md:hidden mb-10 justify-between items-center">
        <Logo />
        <Avatar />
      </div>
      <div class="flex gap-8 justify-between">
        <div class="grow-[1] hidden md:flex items-center">
          <Logo />
        </div>
        <div class="flex items-stretch justify-between gap-4 grow-[3]">
          <DeviceSearchBox class="flex-1" />
          <QrButton />
        </div>
        <div class="my-auto hidden md:flex grow-[2] gap-3 justify-end">
          <Avatar />
        </div>
      </div>
    </div>
    <NavBar />
  </div>
</template>
