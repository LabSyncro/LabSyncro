<script setup lang="ts">
import { deviceKindService } from '~/services';
const props = defineProps<{
  category: { id: string; name: string };
}>();
const listRef = ref<HTMLDivElement | null>(null);
const listWidth = ref<number | null>(null);
function updateListWidth () {
  if (!listRef.value) {
    listWidth.value = null;
  }
  listWidth.value = listRef.value!.offsetWidth;
}
onMounted(() => updateListWidth());
onMounted(() => document.defaultView!.addEventListener('resize', updateListWidth));
onUnmounted(() => document.defaultView!.removeEventListener('resize', updateListWidth));
const ITEM_WIDTH = 180;
const numberOfItemsShown = computed(() => {
  if (!listWidth.value) {
    return null;
  }
  if (listWidth.value < 50) {
    return 0;
  }
  return Math.floor((listWidth.value - 75) / (ITEM_WIDTH + 10));
});

const totalPages = ref(0);
const totalItems = ref(0);
const currentPage = ref(0);

watch([numberOfItemsShown], async () => {
  totalItems.value = await deviceKindService.getTotalItems(props.category.id, {});
  totalPages.value = Math.ceil(totalItems.value / numberOfItemsShown.value!);
});

async function fetchItem (offset: number): Promise<{ thumbnailUrl: string, manufacturer: string | null, title: string, quantity: number, unit: string, id: string }> {
  await nextTick();
  const pageNumberOfItem = Math.floor(offset / numberOfItemsShown.value!);
  const offsetInPage = offset -  pageNumberOfItem * numberOfItemsShown.value!;
  const res = await deviceKindService.getDeviceKindsByCategoryId(props.category.id, pageNumberOfItem, numberOfItemsShown.value!, {});
  const deviceKind = res.deviceKinds[offsetInPage];
  return {
    thumbnailUrl: deviceKind.mainImage,
    manufacturer: deviceKind.manufacturer,
    title: deviceKind.name,
    quantity: deviceKind.quantity,
    unit: deviceKind.unit,
    id: deviceKind.id,
  };
}

const listDirection = ref<'slide-right' | 'slide-left' | null>(null);

function pageLeft () {
  listDirection.value = 'slide-right';
  currentPage.value = (currentPage.value - 1 + totalPages.value) % totalPages.value;
}

function pageRight () {
  listDirection.value = 'slide-left';
  currentPage.value = (currentPage.value + 1) % totalPages.value;
}
</script>

<template>
  <div class="mt-5">
    <div class="pl-4 pr-4 md:pl-28 md:pr-28 mb-1 sm:mb-3 flex gap-4 justify-between items-start">
      <h3 class="font-bold">{{ props.category.name }}</h3>
      <NuxtLink class="hidden sm:block text-sm text-slate-dark min-w-16" :href="`/devices?categoryId=${props.category.id}`">
        Xem thêm
      </NuxtLink>
    </div>
    <NuxtLink class="block sm:hidden mb-5 pl-4 pr-4 text-sm text-slate-dark min-w-16" :href="`/devices?categoryId=${props.category.id}`">
      Xem thêm
    </NuxtLink>
    <div ref="listRef" class="group flex justify-center items-center gap-5">
      <button
        class="opacity-0 group-hover:opacity-100 bg-secondary-dark flex items-center justify-center rounded-full w-8 h-8 text-tertiary-dark z-50"
        @click="pageLeft">
        <Icon aria-hidden name="i-heroicons-chevron-left" />
      </button>
      <TransitionGroup class="flex justify-around gap-2 min-h-64" :name="listDirection || ''" tag="div">
          <div v-for="i in [...Array(numberOfItemsShown).keys()]" :key="i + currentPage * numberOfItemsShown!">
            <DeviceSuspenseItem
              v-if="i + currentPage * numberOfItemsShown! < totalItems" :width="`${ITEM_WIDTH}px`"
              :fetch-fn="() => fetchItem(i + currentPage * numberOfItemsShown!)" />
          </div>
      </TransitionGroup>
      <button
        class="opacity-0 group-hover:opacity-100 bg-secondary-dark flex items-center justify-center rounded-full w-8 h-8 text-tertiary-dark z-50"
        @click="pageRight">
        <Icon aria-hidden name="i-heroicons-chevron-right" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(200px);
}

.slide-left-enter-active {
  transition: all 0.3s ease;
}

.slide-left-enter-to {
  opacity: 1;
}

.slide-left-leave-from {
  opacity: 1;
}

.slide-left-leave-active {
  transition: all 0.1s ease;
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-100px);
  position: absolute;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-100px);
  position: absolute;
}

.slide-right-enter-active {
  transition: all 0.3s ease;
}

.slide-right-enter-to {
  opacity: 1;
}

.slide-right-leave-from {
  opacity: 1;
}

.slide-right-leave-active {
  transition: all 0.1s ease;
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(200px);
}
</style>
