<script setup lang="ts">
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const router = useRouter();
const { userId } = usePermission();

function handleClick() {
  if (!userId.value) {
    const toast = useToast();
    toast.error("Vui lòng đăng nhập để sử dụng tính năng này");
    return;
  }

  router.push("/qr");
}
</script>

<template>
  <button @click="handleClick" class="cursor-pointer h-40 flex items-center text-md">
    <Icon aria-hidden name="i-heroicons-qr-code" class="mr-1.5" />
    QR của tôi
  </button>
</template>
