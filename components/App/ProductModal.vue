<script setup lang="ts">
import { categoryService } from '@/services';
const props = defineProps<{
  active: boolean;
}>();

const categories = await categoryService.getCategories();
const hoveredCategoryId = ref(null);

function onHoveredCategory (id: number) {
  hoveredCategoryId.value = id;
}

function onMouseoutCategory (id: number) {
  if (hoveredCategoryId.value === id) hoveredCategoryId.value = null;
}
</script>

<template>
  <div v-if="props.active" id="menu" role="menu" class="absolute top-[184px] text-primary-dark left-0 w-[330px] md:w-[350px] bg-white z-50">
    <div class="shadow-[0_8px_8px_rgba(0,0,0,0.1)]">
      <div class="pl-12 p-5 self-stretch shadow-[10px_0_10px_rgba(0,0,0,0.1)]">
        <a
          v-for="(category, index) in categories"
          :key="index"
          class="relative block cursor-pointer my-2.5 py-1 px-2 pr-8 text-left text-normal rounded-md hover:bg-secondary-dark"
          @click="onSelectedCategory(index)"
          @mouseenter="onHoveredCategory(index)"
          @mouseleave="onMouseoutCategory(index)"
        >
          {{ category }}
          <Icon
            v-if="index === selectedCategoryId"
            aria-hidden
            class="absolute top-[8px] right-[6px]"
            name="i-heroicons-check"
          />
        </a>
      </div>
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
