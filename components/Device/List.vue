<script setup lang="ts">
import { deviceKindService } from '~/services';
const props = defineProps<{
  category: { id: number; name: string };
}>();
const listRef = ref(null);
const listWidth = ref(null);
function updateListWidth() {
  if (!listRef.value) {
    listWidth.value = null;
  }
  listWidth.value = listRef.value.offsetWidth;
}
onMounted(() => updateListWidth());
onMounted(() => document.defaultView.addEventListener('resize', updateListWidth));
onUnmounted(() => document.defaultView.removeEventListener('resize', updateListWidth));
const ITEM_WIDTH = 180;
const itemNo = computed(() => {
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

watch([itemNo], async () => {
  totalItems.value = await deviceKindService.getTotalItems(props.category.id);
  totalPages.value = Math.ceil(totalItems.value / itemNo.value);
});

async function fetchItem(offset: number) {
  await nextTick();
  const { deviceKinds: [deviceKind] } = await deviceKindService.getDeviceKindsByCategoryId(props.category.id, offset, 1);
  return {
    thumbnailUrl: deviceKind.mainImage,
    manufacturer: deviceKind.manufacturer,
    title: deviceKind.name,
    quantity: deviceKind.quantity,
    unit: deviceKind.unit,
    id: deviceKind.id,
  };
}

function pageLeft() {
  currentPage.value = (currentPage.value - 1 + totalPages.value) % totalPages.value;
}

function pageRight() {
  currentPage.value = (currentPage.value + 1) % totalPages.value;
}
</script>

<template>
  <div class="mt-5">
    <div class="pl-16 pr-16 lg:pl-28 lg:pr-28 mb-3 flex justify-between">
      <h3 class="font-bold">{{ props.category.name }}</h3>
      <NuxtLink class="text-sm text-slate-dark" :href="`/devices?categoryId=${props.category.id}`">
        Xem thêm
      </NuxtLink>
    </div>
    <div ref="listRef" class="group flex justify-center items-center gap-5">
      <button
        class="opacity-0 group-hover:opacity-100 bg-secondary-dark flex items-center justify-center rounded-full w-8 h-8 text-tertiary-dark"
        @click="pageLeft">
        <Icon aria-hidden name="i-heroicons-chevron-left" />
      </button>
      <div class="flex justify-around gap-2 min-h-64">
        <div v-for="i in [...Array(itemNo).keys()]" :key="i + currentPage * itemNo">
          <DeviceSuspenseItem
            v-if="i + currentPage * itemNo < totalItems" :width="`${ITEM_WIDTH}px`"
            :fetch-fn="() => fetchItem(i + currentPage * itemNo)" />
        </div>
      </div>
      <button
        class="opacity-0 group-hover:opacity-100 bg-secondary-dark flex items-center justify-center rounded-full w-8 h-8 text-tertiary-dark"
        @click="pageRight">
        <Icon aria-hidden name="i-heroicons-chevron-right" />
      </button>
    </div>
  </div>
</template>
