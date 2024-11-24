<script setup lang="ts">
import { debounce } from 'lodash-es';
import { deviceKindService } from '~/services';

const searchText = ref('');
const updateSearchText = debounce((value: string) => searchText.value = value, 150);
const { isActive: isDropdownActive, setInactive } = useClick(useTemplateRef('dropdown'));

const focusedSearchItemIndex = ref<number | null>(null);
const numberOfSearchItemsShown = 4;
const searchItems = ref<{ id: string; name: string; image: string }[]>([]);
watch(searchText, async () => {
  focusedSearchItemIndex.value = null;
  const data = await deviceKindService.getDeviceKinds(0, numberOfSearchItemsShown, { searchText: searchText.value || undefined, searchFields: ['device_name'] });
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

function goToSearchItem () {
  const router = useRouter();
  setInactive();
  if (focusedSearchItemIndex.value === null) {
    router.push(`/devices?q=${searchText.value}`);
    return;
  };
  router.push(`/devices/${searchItems.value[focusedSearchItemIndex.value].id}`);
  searchText.value = '';
}

function unfocusSearchItem () {
  focusedSearchItemIndex.value = null;
}
</script>

<template>
  <div ref="dropdown" class="relative">
    <div class="relative">
      <input
        :value="searchText"
        class="bg-white text-primary-light placeholder:text-primary-light border-2 h-11 w-[100%] pl-10 pr-3 rounded-md text-md placeholder:text-normal"
        type="search" placeholder="Tên loại thiết bị" @keydown.down="focusNextSearchItem" @keydown.up="focusPrevSearchItem" @keydown.enter="goToSearchItem" @keydown.esc="unfocusSearchItem"
        @input="(e) => updateSearchText((e.target as any).value)">
      <Icon
        aria-hidden class="absolute left-3 top-[12px] text-xl text-primary-dark"
        name="i-heroicons-magnifying-glass" />
    </div>

    <div :class="`${isDropdownActive ? 'flex' : 'hidden'} flex-col gap-1 absolute bg-white p-1 mt-1 w-[120%] z-50`">
      <NuxtLink v-for="(item, index) in searchItems" :key="item.id" :class="`px-2 text-normal p-1 flex gap-2 hover:bg-gray-100 ${focusedSearchItemIndex === index ? 'bg-secondary-light' : ''}`" :href="`/devices/${item.id}`" @click="setInactive">
        <img :src="item.image" class="h-6">
        <p class="bg-gray-100 border border-gray-200 px-1 rounded-sm">
          <HighlightText :text="item.id" :match-text="searchText" />
        </p>
        <HighlightText class="line-clamp-1" :text="item.name" :match-text="searchText || undefined" />
      </NuxtLink>
      <NuxtLink
class="flex gap-1 justify-between items-center py-1 px-2 rounded-md bg-primary-darker text-white"
      :href="`/devices?q=${searchText}`">
        <p>Xem tất cả</p>
        <Icon aria-hidden name="i-heroicons-chevron-double-right" class="text-lg" />
      </NuxtLink>
    </div>
  </div>
</template>
