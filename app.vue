<script setup lang="ts">
import { ref } from 'vue';
import { useNuxtApp } from '#app';  // Ensure this is imported

interface DataItem {
  id: number;
  name: string;
}

const data = ref<DataItem[]>([]);

// Access the injected dbClient
const { $dbClient } = useNuxtApp();

const result = await $dbClient.query<DataItem>('SELECT id, name from role');
data.value = result.rows;
</script>

<template>
  <div>
    <h1>Database Data</h1>
    <ul>
      <li v-for="item in data" :key="item.id">{{ item.name }}</li>
    </ul>
  </div>
</template>
