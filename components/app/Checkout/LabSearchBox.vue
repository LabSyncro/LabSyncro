<script setup lang="ts">
import { laboratoryService } from '~/services';

const emits = defineEmits<{
  select: [string],
}>();

const searchText = ref('');

const { isActive: isDropdownActive, setInactive } = useClick(useTemplateRef('dropdown'));

function setInput (index: number) {
  const lab = searchItems.value[index];
  searchText.value = `${lab.room}, ${lab.branch}`;
  emits('select', lab.id);
  setInactive();
}

const focusedSearchItemIndex = ref<number | null>(null);

const numberOfSearchItemsShown = 6;

const searchItems = ref<{ id: string, name: string; room: string; branch: string }[]>([]);
watch(searchText, async () => {
  focusedSearchItemIndex.value = null;
  const data = (await laboratoryService.getAllLabs({ searchText: searchText.value || undefined, searchFields: ['location', 'lab_name'] })).labs;
  searchItems.value = data.slice(0, numberOfSearchItemsShown);
});

function focusNextSearchItem () {
  if (focusedSearchItemIndex.value === null) focusedSearchItemIndex.value = -1;
  focusedSearchItemIndex.value = (focusedSearchItemIndex.value + 1) % numberOfSearchItemsShown;
}

function focusPrevSearchItem () {
  if (focusedSearchItemIndex.value === null) focusedSearchItemIndex.value = 0;
  focusedSearchItemIndex.value = (focusedSearchItemIndex.value - 1 + numberOfSearchItemsShown) % numberOfSearchItemsShown;
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
        class="bg-white border-2 w-[100%] p-1 px-2 rounded-md text-md"
        type="search" @keydown.down="focusNextSearchItem" @keydown.up="focusPrevSearchItem" @keydown.enter="focusedSearchItemIndex !== null && setInput(focusedSearchItemIndex)" @keydown.esc="unfocusSearchItem">
    </div>

    <div v-if="searchItems.length" :class="`${isDropdownActive ? 'flex' : 'hidden'} flex-col gap-1 absolute bg-white p-1 mt-1 w-[100%] z-50 shadow-[0_0px_16px_1px_rgba(0,0,0,0.3)]`">
      <button v-for="(item, index) in searchItems" :key="item.id" :class="`px-2 text-normal p-1 flex gap-2 hover:bg-gray-100 ${focusedSearchItemIndex === index ? 'bg-secondary-light' : ''}`" @click="setInput(index)">
        {{ `${item.room}, ${item.branch} - ${item.name}` }}
      </button>
    </div>
  </div>
</template>
