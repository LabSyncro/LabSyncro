<script setup lang='ts'>
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  to: string;
  active?: boolean;
  class?: HTMLAttributes['class'];
}>();

const route = useRoute();
const isActive = computed(() => props.active || route.path === props.to);
</script>

<template>
  <router-link :to="props.to" :class="[
    'flex items-center px-3 py-2 text-normal rounded-md transition-colors',
    isActive
      ? 'bg-blue-100 text-blue-900'
      : 'text-gray-900 hover:bg-gray-100',
    props.class
  ]">
    <slot />
  </router-link>
</template>
