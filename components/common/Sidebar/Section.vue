`<template>
  <div class="space-y-3">
    <h3 class="text-sm font-medium text-gray-500">{{ title }}</h3>
    <div class="space-y-1">
      <slot/>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>();</script>`
