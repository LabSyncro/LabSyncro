<script setup lang="ts">
const props = defineProps<{
  matchText?: string;
  text: string;
}>();
</script>

<template>
  <p v-if="matchText">
    <span v-for="(fragment, index) in props.text.split(new RegExp(`(${props.matchText.replaceAll('(', '\\(')})`, 'ig'))"
      :key="index">
      <span :class="index % 2 ? 'text-tertiary-dark' : ''">{{ fragment }}</span>
    </span>
  </p>
  <p v-else>
    {{ text }}
  </p>
</template>
