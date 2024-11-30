`<template>
  <NuxtLink
:to="to"
    class="flex items-center gap-2 px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
    :class="{ 'bg-blue-50 text-blue-600': isActive }">
    <Icon :name="icon" class="w-5 h-5" />
    <span class="text-sm">
      <slot/>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  to: string
  icon: string
}>();

const route = useRoute();
const isActive = computed(() => route.path === props.to);
</script>`
