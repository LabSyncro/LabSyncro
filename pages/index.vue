<script lang="ts" setup>
definePageMeta({
  middleware: ['permission'],
  permission: 'home:own',
});

const showDialog = ref(false);
const userId = ref('');

const handleVirtualKeyboardDetection = (input: string): void => {
  showDialog.value = true;
  userId.value = input;
};

useVirtualKeyboardDetection(handleVirtualKeyboardDetection);

</script>

<template>
  <div>
    <div @click="() => { showDialog = true }">
      <IntroBanner />
    </div>
    <div>
      <DeviceBorrowSection />
    </div>
    <BorrowReturnDialog v-model:is-open="showDialog" :user-id="userId" />
  </div>
</template>
