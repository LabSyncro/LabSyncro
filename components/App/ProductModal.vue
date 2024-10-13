<script setup lang="ts">
  const props = defineProps<{
    active: boolean;
  }>();
</script>

<template>
  <div v-if="props.active" class="fixed animate-in">
  </div> 
</template>
