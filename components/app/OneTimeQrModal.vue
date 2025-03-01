<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';

const props = defineProps<{
  userId: string;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const { qrDataUrl, timeLeft, isLoading, generateQrCode, cleanUp } = useOneTimeQrCode();

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if (props.userId) {
      generateQrCode(props.userId);
    } else {
      emit('close');
      const toast = useToast();
      toast.error('Không có ID người dùng. Vui lòng đăng nhập và thử lại.');
    }
  } else {
    cleanUp();
  }
});

watch(() => props.userId, (userId) => {
  if (props.isOpen && userId) {
    generateQrCode(userId);
  }
});

watch(() => timeLeft.value, (newTime) => {
  if (newTime === 0 && props.isOpen) {
    // Automatically regenerate when timer reaches 0
    regenerateQrCode();
  }
});

function regenerateQrCode() {
  if (props.userId) {
    generateQrCode(props.userId);
  }
}

onMounted(() => {
  if (props.isOpen) {
    if (props.userId) {
      generateQrCode(props.userId);
    } else {
      emit('close');
      const toast = useToast();
      toast.error('Không có ID người dùng. Vui lòng đăng nhập và thử lại.');
    }
  }
});
</script>

<template>
  <Dialog :open="isOpen" @close="$emit('close')">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Mã QR dùng một lần</DialogTitle>
        <DialogDescription>
          Quét mã QR này để xác thực danh tính của bạn. Mã QR này chỉ có hiệu lực trong {{ timeLeft }} giây.
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col items-center justify-center gap-4 p-4">
        <div v-if="isLoading" class="flex items-center justify-center w-64 h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <div v-else-if="qrDataUrl" class="border-2 border-gray-200 p-2">
          <img :src="qrDataUrl" alt="QR Code" class="w-64 h-64" />
        </div>
        <div v-else class="text-center text-red-500">
          Không thể tạo mã QR. Vui lòng thử lại.
        </div>
        
        <div class="flex items-center gap-2">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full"
              :style="{ width: `${(timeLeft / 30) * 100}%` }"
            ></div>
          </div>
          <span class="text-sm text-gray-500">{{ timeLeft }}s</span>
        </div>
        
        <Button
          @click="regenerateQrCode"
          class="w-full"
          :disabled="isLoading"
        >
          <Icon v-if="isLoading" name="i-heroicons-arrow-path" class="w-4 h-4 mr-2 animate-spin" />
          <Icon v-else name="i-heroicons-arrow-path" class="w-4 h-4 mr-2" />
          Tạo lại mã QR
        </Button>
      </div>
      <DialogFooter class="sm:justify-center">
        <Button variant="outline" @click="$emit('close')">
          Đóng
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
