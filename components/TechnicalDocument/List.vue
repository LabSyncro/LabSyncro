<script setup lang="ts">
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

const ITEM_WIDTH = 330;
const itemNo = computed(() => {
  if (!listWidth.value) {
    return null;
  }
  if (listWidth.value < 50) {
    return 0;
  }
  return Math.floor((listWidth.value - 30) / (ITEM_WIDTH + 10));
});
const items = computed(() => {
  if (!itemNo.value) {
    return [];
  }
  return [...Array(itemNo.value).keys()].map(() => ({
    departmentName: 'Department Name',
    title: 'Phương pháp Nghiên cứu Khoa học',
    summary: `
      Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect nostrud nisi intricate Content. Qui  international first-class nulla ut. 

      Punctual adipisicing, essential lovely queen tempor eiusmod irure. Exclusive izakaya charming Scandinavian impeccable aute quality of life soft power pariatur Melbourne occaecat discerning.
    `,
  }));
});
</script>

<template>
  <div ref="listRef" class="w-[75vw] flex gap-4 justify-center">
    <TechnicalDocumentItem
v-for="(item, index) in items" :key="index" class="min-w-[330px]"
      :department-name="item.departmentName" :title="item.title" :summary="item.summary" />
  </div>
</template>
