<script setup lang="ts">
</script>

<template>
  <div
    class="bg-white p-14 lg:px-32"
    role="banner"
  >
    <div class="flex gap-16">
      <div>
        <AppLogo class="aspect-auto w-48" />
      </div>
      <div class="flex items-stretch gap-2 flex-1">
        <AppDeviceFilter /> 
        <AppSearchBox class="flex-1" />
      </div>
      <div class="flex my-auto">
        <AppAvatar />
        <AppShoppingButton />
      </div>
    </div>
    <nav>
    </nav>
  </div>
</template>
