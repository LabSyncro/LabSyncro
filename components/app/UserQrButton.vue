<script setup lang="ts">
import { useToast } from 'vue-toastification';

const { userId } = usePermission();
const showQrModal = ref(false);

function openQrModal() {
  if (!userId.value) {
    // User not logged in, handle this case
    const toast = useToast();
    toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
    return;
  }
  
  showQrModal.value = true;
}
</script>

<template>
  <button @click="openQrModal" class="cursor-pointer h-16 px-2.5 sm:px-5 hover:bg-primary-darker flex items-center">
    <Icon aria-hidden name="i-heroicons-qr-code" class="mr-1.5" />
    QR của tôi
  </button>
  
  <OneTimeQrModal
    :is-open="showQrModal"
    :user-id="userId || ''" 
    @close="showQrModal = false" 
  />
</template>
