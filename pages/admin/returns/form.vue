<script setup lang="ts">
definePageMeta({
  middleware: ['permission']
});

import moment from 'moment';
import { deviceKindService, receiptService, userService, deviceService } from '~/services';
import { useToast } from 'vue-toastification';
import type { ToastInterface } from 'vue-toastification';
import OneTimeQrModal from '~/components/app/OneTimeQrModal.vue';

// Types
interface DeviceInCart {
  id: string;
  name: string;
  deviceIds: string[];
  category: string;
}

interface ReturnFormState {
  userId: string;
  receiptCode: string;
  returnDate: Date;
  returnLabId: string | null;
}

// Setup
const route = useRoute();
const { lab } = useLab();
const toast: ToastInterface = useToast();

// Cart state
const currentDeviceKindId = ref<string | null>(null);
const devicesInCart = ref<DeviceInCart[]>([]);
const selectedDevices = computed(() => devicesInCart.value.flatMap(deviceKind => deviceKind.deviceIds));

// Form state
const formState = reactive<ReturnFormState>({
  userId: '',
  receiptCode: generateUniqueId(),
  returnDate: new Date(),
  returnLabId: lab.value?.id || null
});

// User info state
const userInfo = reactive({
  fullName: '',
  role: '',
  translatedRole: 'Vai trò không hợp lệ'
});

// Validation
const VALID_ROLES = ['student', 'teacher', 'lab_admin'] as const;
type ValidRole = typeof VALID_ROLES[number];

const isValidForm = computed(() => {
  return (
    formState.userId &&
    formState.receiptCode &&
    formState.returnDate &&
    formState.returnLabId &&
    devicesInCart.value.length > 0
  );
});

// Utilities
function generateUniqueId(): string {
  const datePrefix = moment().format('YYYYMMDD');
  const randomSuffix = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `${datePrefix}/${randomSuffix}`;
}

function translateRole(role: ValidRole): string {
  const roleMap: Record<ValidRole, string> = {
    student: 'Sinh viên',
    teacher: 'Giảng viên',
    lab_admin: 'Quản lý phòng lab'
  };
  return roleMap[role] || 'Vai trò không hợp lệ';
}

// Modal handlers
function openModalForDeviceId(id: string) {
  currentDeviceKindId.value = id;
}

function closeModal() {
  currentDeviceKindId.value = null;
}

// Cart handlers
async function addDevice({ kind, id }: { kind: string; id: string }) {
  try {
    const deviceKind = devicesInCart.value.find(item => item.id === kind);
    if (deviceKind) {
      if (!deviceKind.deviceIds.includes(id)) {
        deviceKind.deviceIds.push(id);
      }
      return;
    }
    const deviceKindMeta = await deviceKindService.getById(kind);
    devicesInCart.value.push({
      id: kind,
      name: deviceKindMeta.name,
      category: deviceKindMeta.categoryName,
      deviceIds: [id]
    });
  } catch (error) {
    toast.error('Không thể thêm thiết bị');
  }
}

function deleteDevice({ kind, id }: { kind: string; id: string }) {
  const deviceKind = devicesInCart.value.find(item => item.id === kind);
  if (!deviceKind) return;
  
  const index = deviceKind.deviceIds.indexOf(id);
  if (index === -1) return;
  
  deviceKind.deviceIds.splice(index, 1);
  if (deviceKind.deviceIds.length === 0) {
    const kindIndex = devicesInCart.value.findIndex(item => item.id === kind);
    devicesInCart.value.splice(kindIndex, 1);
  }
}

function deleteDeviceKinds(kindIds: string[]) {
  kindIds.forEach(kindId => {
    const index = devicesInCart.value.findIndex(item => item.id === kindId);
    if (index !== -1) {
      devicesInCart.value.splice(index, 1);
    }
  });
}

// User handlers
async function handleUserCodeChange(userId: string) {
  const isValidUserCode = /^\d{7}$/.test(userId);
  
  if (!isValidUserCode) {
    userInfo.fullName = '';
    userInfo.role = '';
    userInfo.translatedRole = 'Vai trò không hợp lệ';
    return;
  }

  try {
    const userMeta = await userService.getUserById(userId);
    if (!userMeta) throw new Error('User not found');

    userInfo.fullName = userMeta.name || '';
    const userRole = userMeta.roles[0]?.key;
    if (userRole && VALID_ROLES.includes(userRole as ValidRole)) {
      userInfo.role = userRole;
      userInfo.translatedRole = translateRole(userRole as ValidRole);
    } else {
      userInfo.role = '';
      userInfo.translatedRole = 'Vai trò không hợp lệ';
    }
  } catch (error) {
    toast.error('Không thể tìm thấy thông tin người dùng');
  }
}

// Form submission
async function submitReturnForm() {
  if (!isValidForm.value) {
    toast.error('Vui lòng điền đầy đủ thông tin');
    return;
  }

  try {
    await receiptService.submitReturnRequest({
      receiptId: formState.receiptCode,
      returnDate: formState.returnDate,
      returnLabId: formState.returnLabId!,
      returnerId: formState.userId,
      deviceIds: selectedDevices.value
    });
    toast.success('Đã trả thiết bị thành công');
    reloadNuxtApp();
  } catch (error) {
    toast.error('Không thể trả thiết bị');
  }
}

// QR code state
const showQrModal = ref(false);

// Handle scan QR code button click
function handleScanQrClick() {
  toast.info('Quét mã QR một lần của người dùng');
}

// Scanner handlers
const handleVirtualKeyboardDetection = async (input: string, type?: 'userId' | 'device' | 'oneTimeQr') => {
  if (type === 'userId') {
    formState.userId = input;
    await handleUserCodeChange(input);
  } else if (type === 'device') {
    try {
      const deviceKindId = input.match(/\/devices\/([a-fA-F0-9]+)/)?.[1];
      const deviceId = input.match(/[?&]id=([a-fA-F0-9]+)/)![1];
      
      const { id, status } = await deviceService.checkDevice(deviceId, lab.value.id);
      if (status === 'borrowing') {
        await addDevice({ kind: deviceKindId!, id: deviceId });
      } else {
        toast.warning('Thiết bị này không trong trạng thái đang mượn');
      }
    } catch (error) {
      toast.error('Không thể kiểm tra thiết bị');
    }
  } else if (type === 'oneTimeQr') {
    try {
      const { verifyScannedQrCode } = useOneTimeQrCode();
      
      const result = verifyScannedQrCode(input);
      if (result) {
        const { userId } = result;
        formState.userId = userId;
        await handleUserCodeChange(userId);
        toast.success('Xác thực người dùng thành công');
      } else {
        toast.error('Mã QR không hợp lệ hoặc đã hết hạn');
      }
    } catch (error) {
      toast.error('Không thể xác thực mã QR');
    }
  }
};

// Initialize from route query params
onMounted(async () => {
  const { userId, deviceKindId, deviceId } = route.query;

  if (userId && typeof userId === 'string') {
    formState.userId = userId;
    await handleUserCodeChange(userId);
  }

  if (deviceKindId && deviceId && typeof deviceKindId === 'string' && typeof deviceId === 'string') {
    await addDevice({ kind: deviceKindId, id: deviceId });
  }
});

// Watch for user input changes
watch(() => formState.userId, handleUserCodeChange);

useVirtualKeyboardDetection(handleVirtualKeyboardDetection, {
  userId: { length: 7 },
  device: { pattern: /^https?:\/\/[^/]+\/devices\/[a-fA-F0-9]{8}\?id=[a-fA-F0-9]+$/ },
  oneTimeQr: { pattern: /^\{"token":"[0-9]{6}","userId":"[0-9]{7}"/ },
  scannerThresholdMs: 100,
  maxInputTimeMs: 1000,
});
</script>

<template>
  <div class="mx-6 sm:mx-16 my-10">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <NuxtLink href="/" class="flex justify-center items-center text-lg">
            <Icon aria-hidden name="i-heroicons-home" />
          </NuxtLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <p class="font-semibold">/</p>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <NuxtLink class="text-normal font-bold underline text-black" href="/admin/borrows/form">
            Trả thiết bị
          </NuxtLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <main class="my-10">
      <div class="flex flex-col xl:flex-row gap-8">
        <div class="flex-1">
          <div class="bg-white p-4">
            <h2 class="text-lg mb-6">Danh sách trả</h2>
            <div class="flex gap-4 mb-6">
              <CheckoutDeviceSearchBox @device-select="openModalForDeviceId" />
              <CheckoutQrButton />
              <CheckoutDeviceSelectModal
:kind-id="currentDeviceKindId" :selected-devices="selectedDevices"
                @close-modal="closeModal" @device-add="addDevice" @device-delete="deleteDevice" />
            </div>
            <CheckoutDeviceKindTable
:cart="devicesInCart" @device-kinds-delete="deleteDeviceKinds"
              @device-kind-link-click="openModalForDeviceId" />
          </div>
        </div>
        <div class="flex flex-col gap-8 min-w-[350px]">
          <div class="bg-white p-4">
            <div class="flex gap-2 justify-between items-center mb-4">
              <h2 class="text-xl">Người trả</h2>
              <button
                class="bg-slate-100 border border-slate-400 text-slate-dark rounded-md flex items-center gap-2 p-2"
                @click="handleScanQrClick">
                <Icon aria-hidden class="left-3 top-[13px] text-xl" name="i-heroicons-qr-code" />
                <p>Quét mã người trả</p>
              </button>
              
              <!-- One-time QR code modal -->
              <OneTimeQrModal 
                :is-open="showQrModal"
                :user-id="formState.userId" 
                @close="showQrModal = false" />
            </div>
            <div role="form">
              <div class="mb-4">
                <div class="mb-2">
                  <label class="text-sm text-gray-600">
                    Mã số sinh viên <span class="text-red-500">*</span>
                  </label>
                  <Input 
                  :model-value="formState.userId" 
                  @update:model-value="value => formState.userId = value.toString()"
                  class="text-lg" 
                />
                </div>
                <div v-if="/^\d{7}$/.test(formState.userId)" class="text-lg">
                  {{ userInfo.fullName }} | {{ userInfo.translatedRole }}
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white p-4">
            <h2 class="text-xl mb-4">Thông tin trả</h2>
            <div role="form">
              <div class="mb-4">
                <div class="text-lg">
                  <div>
                    Mã đơn:
                    <span class="font-semibold text-blue-600">{{ formState.receiptCode }}</span>
                  </div>
                  <div>
                    Ngày trả:
                    <span class="font-semibold text-blue-600">{{ formState.returnDate.toISOString().substr(0, 10) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button class="bg-tertiary-darker text-normal text-white rounded-md p-2 px-4 w-full" @click="submitReturnForm">
              Xác nhận trả
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

