<script setup lang="ts">
import {
  QrCode,
  Download,
  Share2,
  RefreshCw,
  ArrowLeft,
} from "lucide-vue-next";
import { useToast } from "vue-toastification";

definePageMeta({
  //   auth: {
  //     authenticated: true,
  //     navigateUnauthenticatedTo: "/login",
  //   },
  layout: "qr",
});

const toast = useToast();
const { userId } = usePermission();
const {
  qrDataUrl,
  timeLeft,
  isLoading,
  generateQrCode,
  startCountdown,
  cleanUp,
} = useOneTimeQrCode();
const isMobile = ref(false);

async function initializeQR() {
  if (!userId.value) {
    const toast = useToast();
    toast.error("Không có ID người dùng. Vui lòng đăng nhập và thử lại.");
    return;
  }

  try {
    cleanUp();
    await new Promise((resolve) => setTimeout(resolve, 50));
    await generateQrCode(userId.value);

    if (qrDataUrl.value) {
      startCountdown();
    }
  } catch (error) {
    toast.error("Có lỗi xảy ra khi tạo mã QR. Vui lòng thử lại.");
  }
}

onMounted(() => {
  checkIsMobile();
  window.addEventListener("resize", checkIsMobile);
  initializeQR();
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkIsMobile);
  cleanUp();
});

const router = useRouter();
router.beforeEach((to, from, next) => {
  if (from.path === "/qr" || (to.path === "/qr" && from.path !== "/qr")) {
    cleanUp();
  }
  next();
});

function checkIsMobile() {
  isMobile.value = window.innerWidth < 768;
}

watch(
  () => timeLeft.value,
  (newTime, oldTime) => {
    // Only trigger regeneration if:
    // 1. Time actually changed to 0 (not just initialized as 0)
    // 2. We had a previous non-zero time
    // 3. We have a QR code (meaning we're in an active session)
    if (newTime === 0 && oldTime > 0 && qrDataUrl.value) {
      initializeQR();
    }
  }
);

function downloadQR() {
  if (!qrDataUrl.value) return;

  const link = document.createElement("a");
  link.href = qrDataUrl.value;
  link.download = `qr-code-${Date.now()}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function shareQR() {
  if (!qrDataUrl.value || !navigator.share) {
    const toast = useToast();
    toast.info("Tính năng chia sẻ không được hỗ trợ trên trình duyệt này");
    return;
  }

  navigator
    .share({
      title: "Mã QR xác thực của tôi",
      text: "Đây là mã QR dùng một lần để xác thực danh tính của tôi",
      url: window.location.href,
    })
    .catch(() => {
      const toast = useToast();
      toast.error("Không thể chia sẻ mã QR");
    });
}
</script>

<template>
  <div class="md:container mx-auto md:max-w-xl">
    <Card class="w-full overflow-hidden backdrop-blur-sm bg-white/90 shadow-lg">
      <CardHeader class="pb-0">
        <div class="flex items-center justify-center gap-2">
          <QrCode class="h-5 w-5 text-primary" />
          <h3 class="font-semibold text-lg">Mã QR dùng một lần</h3>
        </div>
      </CardHeader>

      <CardContent class="pt-6">
        <div class="relative flex justify-center">
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              :key="qrDataUrl"
              class="relative flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-lighter/20 rounded-lg p-4 border border-primary/20 w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
            >
              <div
                v-if="isLoading"
                class="flex items-center justify-center absolute inset-0"
              >
                <div
                  class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
                ></div>
              </div>
              <div
                v-else-if="qrDataUrl"
                class="w-full h-full flex items-center justify-center p-2"
              >
                <img :src="qrDataUrl" alt="QR Code" class="max-w-full h-full" />
              </div>
              <div v-else class="text-center text-red-500 text-sm">
                Không thể tạo mã QR. Vui lòng thử lại.
              </div>
            </div>
          </Transition>
        </div>

        <div class="flex items-center justify-center gap-3 mt-6">
          <p class="text-sm text-gray-600">
            Tự động cập nhật sau
            <span class="font-mono font-medium text-primary">{{
              timeLeft
            }}</span
            >s
          </p>
          <Button
            variant="ghost"
            size="sm"
            @click="initializeQR"
            :disabled="isLoading"
            class="h-8"
          >
            <RefreshCw
              class="h-3.5 w-3.5 mr-1"
              :class="{ 'animate-spin': isLoading }"
            />
            Cập nhật
          </Button>
        </div>
      </CardContent>

      <div class="border-t border-gray-200 my-2"></div>

      <CardFooter class="flex justify-between gap-4 p-4">
        <div class="flex gap-2 flex-1">
          <Button
            variant="outline"
            :size="isMobile ? 'icon' : 'default'"
            @click="downloadQR"
            class="flex-1"
            :disabled="!qrDataUrl || isLoading"
          >
            <Download class="h-4 w-4" :class="{ 'mr-2': !isMobile }" />
            <span v-if="!isMobile">Tải xuống</span>
          </Button>
          <Button
            variant="outline"
            :size="isMobile ? 'icon' : 'default'"
            @click="shareQR"
            class="flex-1"
            :disabled="!qrDataUrl || isLoading"
          >
            <Share2 class="h-4 w-4" :class="{ 'mr-2': !isMobile }" />
            <span v-if="!isMobile">Chia sẻ</span>
          </Button>
        </div>
        <Button variant="outline" @click="$router.push('/')">
          <ArrowLeft class="h-4 w-4 mr-2" />
          Quay lại
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<style scoped>
.scale-95 {
  transform: scale(0.95);
}
.scale-100 {
  transform: scale(1);
}
</style>
