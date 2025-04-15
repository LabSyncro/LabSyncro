<script setup lang="ts">
import { XCircle, CheckCircle } from "lucide-vue-next";
import { useToast } from "vue-toastification";
import { authService } from "~/services";

definePageMeta({
  middleware: ["permission"],
});

const route = useRoute();
const router = useRouter();
const { data: session } = useAuth();
const toast = useToast();

const hmiCode = computed(() => route.query.hmiCode as string);
const isLoading = ref(true);
const isSuccess = ref(false);
const hasError = ref(false);
const errorMessage = ref("");

const goToLogin = () => {
  router.push("/login");
};

onMounted(async () => {
  if (!hmiCode.value) {
    hasError.value = true;
    errorMessage.value = "No HMI code provided";
    isLoading.value = false;
    return;
  }

  await authenticateDevice();
});

async function authenticateDevice(code = hmiCode.value) {
  try {
    isLoading.value = true;
    hasError.value = false;

    await authService.authenticateDevice(code);

    isSuccess.value = true;
    toast.success("Device connected successfully");
  } catch (error: any) {
    hasError.value = true;
    errorMessage.value = error.data?.message;

    toast.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center p-4 h-full">
    <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
      <div v-if="isLoading" class="text-center">
        <div
          class="inline-block w-8 h-8 border-4 border-tertiary-darker border-t-transparent rounded-full animate-spin mb-4"
        ></div>
        <h2 class="text-xl font-semibold text-gray-900">
          Authenticating Device...
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          Please wait while we link your device.
        </p>
      </div>

      <div v-else-if="hasError" class="text-center">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4"
        >
          <XCircle class="w-6 h-6 text-red-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900">
          Authentication Failed
        </h2>
        <p class="mt-2 text-sm text-gray-500">{{ errorMessage }}</p>
        <Button @click="goToLogin" class="mt-4 w-full">Return to Login</Button>
      </div>

      <div v-else-if="isSuccess" class="text-center">
        <div
          class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4"
        >
          <CheckCircle class="w-6 h-6 text-green-600" />
        </div>
        <h2 class="text-xl font-semibold text-gray-900">Device Connected!</h2>
        <p class="mt-2 text-sm text-gray-500">
          Your device has been successfully authenticated. You can now close
          this window and continue using the desktop application.
        </p>
      </div>
    </div>
  </div>
</template>
