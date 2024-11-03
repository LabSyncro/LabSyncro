<script setup lang="ts">
import { categoryService } from '@/services';

const categories = await categoryService.getCategories();
</script>

<template>
  <section class="mt-2 bg-white py-6 px-10">
    <div v-for="(category, index) in categories" :key="index" class="mb-10" >
      <DeviceBorrowList :category="category" />
    </div>
  </section>
</template>
