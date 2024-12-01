<script lang="ts" setup>
definePageMeta({
  middleware: ['permission'],
  permission: 'home:own',
});

const showDialog = ref(false);
const userId = ref('');
const deviceId = ref('');

const handleVirtualKeyboardDetection = (input: string, type?: 'userId' | 'device'): void => {
  if (type === 'userId') {
    showDialog.value = true;
    userId.value = input;
  } else if (type === 'device') {
    deviceId.value = input;
    navigateTo(`/device/${input}`);
  }
};

useVirtualKeyboardDetection(handleVirtualKeyboardDetection, {
  userId: { length: 7 },
  device: { pattern: /^https?:\/\/[^/]+\/devices\/\d{8}\?id=[a-fA-F0-9]+$/ },
  scannerThresholdMs: 100,
  maxInputTimeMs: 1000,
});

</script>

<template>
  <div>
    <div>
      <IntroBanner />
    </div>
    <div>
      <DeviceBorrowSection />
    </div>
    <BorrowReturnDialog v-model:is-open="showDialog" :user-id="userId" />
  </div>
</template>
