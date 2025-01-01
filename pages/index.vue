<script lang="ts" setup>
import { deviceService } from '@/services';

definePageMeta({
  middleware: ['permission']
});

const { lab } = useLab();

const showDialog = ref(false);
const userId = ref('');

const handleVirtualKeyboardDetection = async (input: string, type?: 'userId' | 'device') => {
  if (type === 'userId') {
    showDialog.value = true;
    userId.value = input;
  } else if (type === 'device') {
    const deviceKindId = input.match(/\/devices\/([a-fA-F0-9]+)/)?.[1];
    const deviceId = input.match(/[?&]id=([a-fA-F0-9]+)/)![1];
    const { id, status } = await deviceService.checkDevice(deviceId, lab.value.id);
    if (status === 'borrowing') {
      navigateTo({
        path: '/admin/returns/form',
        query: { deviceKindId, deviceId, userId: '2114417' }
      });
    } else if (status === 'healthy') {
      navigateTo({
        path: '/admin/borrows/form',
        query: { deviceKindId, deviceId }
      });
    }
  }
};

useVirtualKeyboardDetection(handleVirtualKeyboardDetection, {
  userId: { length: 7 },
  device: { pattern: /^https?:\/\/[^/]+\/devices\/[a-fA-F0-9]{8}\?id=[a-fA-F0-9]+$/ },
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
