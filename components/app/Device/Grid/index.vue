<script setup lang="ts">
import { deviceKindService } from '~/services';
import { ITEM_WIDTH } from './constants';

const props = defineProps<{
  categoryId: string | null;
  searchText: string | null;
}>();

const gridWidth = useWidth(useTemplateRef('gridRef'));
const cols = computed(() => {
  if (!gridWidth.value) {
    return null;
  }
  if (gridWidth.value < 50) {
    return 0;
  }
  return Math.min(Math.floor((gridWidth.value - 50) / (ITEM_WIDTH + 10)), 5);
});
const rows = computed(() => {
  if (!gridWidth.value) {
    return null;
  }
  switch (cols.value) {
  case 1: return 20;
  case 2: return 15;
  case 3: return 10;
  default: return 5;
  }
});
const numberOfGridItems = computed(() => {
  if (!cols.value) {
    return null;
  }
  return cols.value * rows.value!;
});
const totalItems = ref(0);
watch(
  () => [props.categoryId, props.searchText],
  async () => totalItems.value = await deviceKindService.getTotalItems(props.categoryId!, { searchText: props.searchText || undefined, searchFields: ['device_id', 'device_name'] }),
  { immediate: true },
);
const totalPages = computed(() => Math.ceil(totalItems.value / numberOfGridItems.value!));
const currentPage = ref(0);
const numberOfPagesShown = 5;
const currentPageGroup = computed(() => Math.floor(currentPage.value / numberOfPagesShown));

async function fetchItem (offset: number): Promise<{ thumbnailUrl: string, manufacturer: string | null, title: string, quantity: number, unit: string, id: string }> {
  await nextTick();
  const pageNumberOfItem = Math.floor(offset / numberOfGridItems.value!);
  const offsetInPage = offset -  pageNumberOfItem * numberOfGridItems.value!;
  const options = { searchText: props.searchText || undefined, searchFields: ['device_id' as const, 'device_name' as const] };
  const res = props.categoryId !== null ? await deviceKindService.getDeviceKindsByCategoryId(props.categoryId, pageNumberOfItem, numberOfGridItems.value!, options) : await deviceKindService.getDeviceKinds(pageNumberOfItem, numberOfGridItems.value!, options);
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

const top = useTemplateRef('top');
function setPage (pageNo: number) {
  top.value!.scrollIntoView();
  currentPage.value = pageNo;
}

function pageLeft () {
  if (currentPageGroup.value === 0) return;
  currentPage.value = (currentPageGroup.value - 1) * numberOfPagesShown;
}

function pageRight () {
  const oldPage = currentPage.value;
  currentPage.value = (currentPageGroup.value + 1) * numberOfPagesShown;
  if (currentPage.value >= totalPages.value) currentPage.value = oldPage;
}
</script>

<template>
  <div ref="gridRef">
    <div v-if="totalItems === 0" class="text-lg text-gray-600">
      Không có kết quả
    </div>
    <div v-else>
      <span ref="top" />
      <div :class="`grid grid-cols-${cols} gap-4 justify-items-center`" role="grid">
        <div
          v-for="i in [...Array(numberOfGridItems).keys()]"
          :key="`${props.categoryId}-${props.searchText}-${i + currentPage * numberOfGridItems!}`">
          <DeviceSuspenseItem
            v-if="i + currentPage * numberOfGridItems! < totalItems" :width="`${ITEM_WIDTH}px`"
            :fetch-fn="() => fetchItem(i + currentPage * numberOfGridItems!)" />
        </div>
      </div>
      <div class="flex justify-center gap-0 mt-10">
        <button class="px-2 py-1 rounded-tl-md rounded-bl-md border-[1px] border-gray-100" @click="pageLeft">
          <Icon aria-hidden class="text-normal" name="i-heroicons-chevron-left" />
        </button>
        <button
v-if="currentPageGroup !== 0" class="text-sm px-2.5 border-[1px] border-l-[0px] border-gray-100"
          @click="setPage(0)">
          1
        </button>
        <div
v-if="currentPageGroup !== 0"
          class="flex justify-center items-center text-sm px-2.5 border-[1px] border-l-[0px] border-gray-100">
          ...
        </div>
        <div v-for="i in [...Array(numberOfPagesShown).keys()]" :key="currentPageGroup * numberOfPagesShown + i">
          <button
v-if="currentPageGroup * numberOfPagesShown + i < totalPages"
            :class="`h-[100%] text-sm px-2.5 border-[1px] border-l-[0px] border-gray-100 ${currentPageGroup * numberOfPagesShown + i === currentPage ? 'bg-green-500 text-white' : ''}`"
            @click="setPage(currentPageGroup * numberOfPagesShown + i)">
            {{ currentPageGroup * numberOfPagesShown + i + 1 }}
          </button>
        </div>
        <div
v-if="(currentPageGroup + 1) * numberOfPagesShown < totalPages"
          class="flex justify-center items-center text-sm px-2.5 border-[1px] border-l-[0px] border-gray-100">
          ...
        </div>
        <button
v-if="(currentPageGroup + 1) * numberOfPagesShown < totalPages"
          class="text-sm px-2.5 border-[1px] border-l-[0px] border-gray-100" @click="setPage(totalPages - 1)">
          {{ totalPages }}
        </button>
        <button
class="px-2 py-1 rounded-tr-md rounded-br-md border-[1px] border-l-[0px] border-gray-100"
          @click="pageRight">
          <Icon aria-hidden class="text-normal" name="i-heroicons-chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>
