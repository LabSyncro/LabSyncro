<script setup lang="ts">
  const props = defineProps<{
    active: boolean;
  }>();
</script>

<template>
  <div role="menu" v-if="props.active" class="fixed top-[180px] text-black left-0 w-[100vw]">
    <div class="p-5 shadow-[0_8px_8px_rgba(0,0,0,0.1)]">
    </div>
  </div> 
</template>
