<script setup lang="ts">
  const props = defineProps<{
    active: boolean;
  }>();
</script>

<template>
  <div role="menu" v-if="props.active" class="fixed top-[180px] text-black left-0 w-[100vw]" id="menu">
    <div class="p-5 shadow-[0_8px_8px_rgba(0,0,0,0.1)]">
    </div>
  </div> 
</template>

<style scoped>
  #menu {
    animation: menu-slide 0.3s linear;
  }
  @keyframes menu-slide {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }
    30% {
      opacity: 0.6;
      transform: translateY(-2px);
    }
    100% {
      opacity: 1;
      transform: translateY(0px);
    }
  }
</style>
