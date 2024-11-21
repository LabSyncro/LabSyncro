<script lang="ts" setup>
definePageMeta({
  middleware: ['permission'],
  permission: 'home:own',
});
</script>

<template>
  <div>
    <div>
      <IntroBanner />
    </div>
    <div>
      <DeviceBorrowSection />
    </div>
  </div>
</template>
