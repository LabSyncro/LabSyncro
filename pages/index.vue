<script lang="ts">
definePageMeta({
  middleware: ['auth']
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
