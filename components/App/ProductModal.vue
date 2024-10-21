<script setup lang="ts">
  import { categoryService } from '@/services';
  const props = defineProps<{
    active: boolean;
  }>();

  const categories = await categoryService.getCategoriesForProductModal();
  const selectedCategoryId = ref(null);
  const hoveredCategoryId = ref(null);

  function onSelectedCategory (id: number) {
    selectedCategoryId.value = id;
  }

  function onHoveredCategory (id: number) {
    hoveredCategoryId.value = id;
  }

  function onMouseoutCategory (id: number) {
    if (hoveredCategoryId.value === id) hoveredCategoryId.value = null;
  }

  const curCategory = computed(() => {
    const index = hoveredCategoryId.value || selectedCategoryId.value;
    if (index === null) return null;
    return categories[index];
  });
</script>

<template>
  <div role="menu" v-if="props.active" class="absolute top-[180px] text-primary-dark left-0 w-[100vw]" id="menu">
    <div class="p-5 md:pl-8 pb-20 lg:pr-24 pt-10 shadow-[0_8px_8px_rgba(0,0,0,0.1)] flex justify-between gap-16 lg:gap-32">
      <div>
        <a
          v-for="(category, index) in categories"
          :key="index"
          class="relative block cursor-pointer my-2.5 py-1 px-2 pr-8 text-left text-normal rounded-md hover:bg-secondary-dark"
          @click="onSelectedCategory(index)"
          @mouseenter="onHoveredCategory(index)"
          @mouseleave="onMouseoutCategory(index)"
        >
          {{ category.name }}
          <Icon
            v-if="index === selectedCategoryId"
            aria-hidden
            class="absolute top-[8px] right-[6px]"
            name="i-heroicons-check"
          />
        </a>
      </div>
      <div class="flex-1">
        <div v-if="curCategory" class="relative">
          <h2
            class="border-tertiary-lighter flex items-center border-b-[1px] font-semibold text-tertiary-dark mb-8 pb-2">
            <span>
              {{ curCategory.name }}
            </span>
            <Icon
              aria-hidden
              class="ml-5"
              name="i-heroicons-chevron-double-right"
            />
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 text-sm gap-6 font-bold">
            <a
              v-for="(category, index) in curCategory.sub"
              :key="index"
              class="line-clamp-1"
            >
              {{ category.name }}
            </a>
          </div>
        </div>
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
