<script lang="ts" setup>
import { deviceService } from '@/services';

definePageMeta({
  middleware: ['permission'],
  permission: 'home:own',
});

const showDialog = ref(false);
const userId = ref('');
const deviceId = ref('');

const handleVirtualKeyboardDetection = async (input: string, type?: 'userId' | 'device') => {
  if (type === 'userId') {
    showDialog.value = true;
    userId.value = input;
  } else if (type === 'device') {
    deviceId.value = input;
    const { id } = await deviceService.checkDevice(input.match(/[?&]id=([a-fA-F0-9]+)/)![1]);
    navigateTo(`/device/${id}`);
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
