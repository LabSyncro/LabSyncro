<script lang="ts">
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
