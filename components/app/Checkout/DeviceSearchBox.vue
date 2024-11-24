<script setup lang="ts">
import { deviceKindService } from '~/services';

const emits = defineEmits<{
  'device-select': [string],
}>();

const searchText = ref('');
const { isActive: isDropdownActive, setInactive } = useClick(useTemplateRef('dropdown'));

const focusedSearchItemIndex = ref<number | null>(null);
const numberOfSearchItemsShown = 6;
const searchItems = ref<{ id: string; name: string; image: string }[]>([]);
watch(searchText, async () => {
  focusedSearchItemIndex.value = null;
  if (searchText.value === '') {
    searchItems.value = [];
    return;
  }
  const data = await deviceKindService.getDeviceKinds(0, numberOfSearchItemsShown, { searchText: searchText.value || undefined, searchFields: ['device_name', 'device_id'] });
  searchItems.value = data.deviceKinds.map(({ name, mainImage, id }) => ({ id, name, image: mainImage }));
});
function focusNextSearchItem () {
  if (focusedSearchItemIndex.value === null) focusedSearchItemIndex.value = -1;
  focusedSearchItemIndex.value = (focusedSearchItemIndex.value + 1) % numberOfSearchItemsShown;
}
function focusPrevSearchItem () {
  if (focusedSearchItemIndex.value === null) focusedSearchItemIndex.value = 0;
  focusedSearchItemIndex.value = (focusedSearchItemIndex.value - 1 + numberOfSearchItemsShown) % numberOfSearchItemsShown;
}
function goToSearchItem (id: string) {
  setInactive();
  emits('device-select', id);
}
function unfocusSearchItem () {
  focusedSearchItemIndex.value = null;
}
</script>

<template>
  <div ref="dropdown" class="relative">
    <div class="relative">
      <input
        v-model="searchText"
        class="bg-white text-primary-light placeholder:text-primary-light border-2 h-11 w-[100%] pl-10 pr-3 rounded-md text-md placeholder:text-normal"
        type="search" placeholder="Tên/Mã loại thiết bị" @keydown.down="focusNextSearchItem" @keydown.up="focusPrevSearchItem" @keydown.enter="focusedSearchItemIndex !== null && goToSearchItem(searchItems[focusedSearchItemIndex!].id)" @keydown.esc="unfocusSearchItem">
      <Icon
        aria-hidden class="absolute left-3 top-[12px] text-xl text-primary-dark"
        name="i-heroicons-magnifying-glass" />
    </div>

    <div :class="`${isDropdownActive && searchItems.length ? 'flex' : 'hidden'} flex-col gap-1 absolute bg-white p-1 mt-1 w-[120%] z-50 shadow-[0_0px_16px_-3px_rgba(0,0,0,0.3)]`">
      <a v-for="(item, index) in searchItems" :key="item.id" :class="`px-2 text-normal p-1 flex justify-start gap-2 hover:bg-gray-100 ${focusedSearchItemIndex === index ? 'bg-secondary-light' : ''}`" @click="goToSearchItem(searchItems[index].id)">
        <img :src="item.image" class="h-6 w-6 block">
        <p class="p-1 px-2 text-nowrap bg-gray-100 border border-gray-300 rounded-md text-normal font-normal leading-none">
          {{ item.id.toUpperCase() }}
        </p>
        <HighlightText class="line-clamp-1" :text="item.name" :match-text="searchText || undefined" />
      </a>
    </div>
  </div>
</template>
