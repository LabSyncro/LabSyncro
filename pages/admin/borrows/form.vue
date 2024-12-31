<script setup lang="ts">
definePageMeta({
  middleware: ['permission']
});

import moment from 'moment';
import { deviceKindService, receiptService, userService, deviceService } from '~/services';
import { useToast } from 'vue-toastification';
import type { ToastInterface } from 'vue-toastification';

// Types
interface DeviceInCart {
  id: string;
  name: string; 
  category: string;
  deviceIds: string[];
}

interface BorrowFormState {
  userId: string;
  receiptCode: string;
  borrowDate: Date;
  borrowLabId: string | null;
  returnDate?: string;
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
const formState = reactive<BorrowFormState>({
  userId: '',
  receiptCode: generateUniqueId(),
  borrowDate: new Date(),
  borrowLabId: lab.value?.id || null,
  returnDate: '',
  returnLabId: null
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
    formState.borrowDate &&
    formState.borrowLabId &&
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

  deviceKind.deviceIds = deviceKind.deviceIds.filter(deviceId => deviceId !== id);
  
  if (deviceKind.deviceIds.length === 0) {
    devicesInCart.value = devicesInCart.value.filter(item => item.id !== kind);
  }
}

function deleteDeviceKinds(kindIds: string[]) {
  devicesInCart.value = devicesInCart.value.filter(item => !kindIds.includes(item.id));
}

function openModalForDeviceId(kind: string) {
  currentDeviceKindId.value = kind;
}

function closeModal() {
  currentDeviceKindId.value = null;
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
    
    // Get the first role from roles array
    const userRole = userMeta.roles[0]?.key;
    if (userRole && VALID_ROLES.includes(userRole as ValidRole)) {
      userInfo.role = userRole;
      userInfo.translatedRole = translateRole(userRole as ValidRole);
    } else {
      console.log(userMeta.roles);
      userInfo.role = '';
      userInfo.translatedRole = 'Vai trò không hợp lệ';
    }
  } catch (error) {
    toast.error('Không thể tìm thấy thông tin người dùng');
  }
}

// Form submission
async function submitBorrowForm() {
  console.log(formState);
  if (!isValidForm.value) {
    toast.error('Vui lòng điền đầy đủ thông tin');
    return;
  }

  try {
    await receiptService.submitBorrowRequest({
      receiptId: formState.receiptCode,
      borrowDate: formState.borrowDate,
      borrowLabId: formState.borrowLabId!,
      expectedReturnLabId: formState.returnLabId!,
      expectedReturnDate: new Date(formState.returnDate!),
      borrowerId: formState.userId,
      deviceIds: selectedDevices.value
    });

    toast.success('Tạo phiếu mượn thành công');
  } catch (error) {
    toast.error('Không thể tạo phiếu mượn');
  }
}

// QR code scanning
const handleVirtualKeyboardDetection = async (input: string, type?: 'userId' | 'device') => {
  if (type === 'userId') {
    formState.userId = input;
    await handleUserCodeChange(input);
  } else if (type === 'device') {
    const deviceKindId = input.match(/\/devices\/([a-fA-F0-9]+)/)?.[1];
    const deviceId = input.match(/[?&]id=([a-fA-F0-9]+)/)![1];
    
    if (!deviceKindId || !deviceId) {
      toast.error('Mã QR không hợp lệ');
      return;
    }

    try {
      const { id, status } = await deviceService.checkDevice(deviceId, lab.value.id);
      
      if (status === 'borrowing') {
        toast.error('Thiết bị đang được mượn');
      } else if (status === 'healthy') {
        await addDevice({ kind: deviceKindId, id: deviceId });
        toast.success('Thêm thiết bị thành công');
      } else {
        toast.error('Thiết bị không khả dụng');
      }
    } catch (error) {
      toast.error('Không thể kiểm tra thiết bị');
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
  device: { pattern: /^https?:\/\/[^/]+\/devices\/\d{8}\?id=[a-fA-F0-9]+$/ },
  scannerThresholdMs: 100,
  maxInputTimeMs: 1000
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
            Mượn thiết bị
          </NuxtLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <main class="my-10">
      <div class="flex flex-col xl:flex-row gap-8">
        <div class="flex-1">
          <div class="bg-white p-4">
            <h2 class="text-lg mb-6">Danh sách mượn</h2>
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
              <h2 class="text-xl">Người mượn</h2>
              <button
                class="bg-slate-100 border border-slate-400 text-slate-dark rounded-md flex items-center gap-2 p-2">
                <Icon aria-hidden class="left-3 top-[13px] text-xl" name="i-heroicons-qr-code" />
                <p>Quét mã người mượn</p>
              </button>
            </div>
            <div role="form">
              <div class="mb-4">
                <div class="mb-2">
                  <label class="text-sm text-gray-600">
                    Mã số sinh viên <span class="text-red-500">*</span>
                  </label>
                  <Input v-model:model-value="formState.userId" class="text-lg" />
                </div>
                <div v-if="/^\d{7}$/.test(formState.userId)" class="text-lg">
                  {{ userInfo.fullName }} | {{ userInfo.translatedRole }}
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white p-4">
            <h2 class="text-xl mb-4">Thông tin mượn</h2>
            <div role="form">
              <div class="mb-4">
                <div class="text-lg">
                  <div>
                    Mã đơn:
                    <span class="font-semibold text-blue-600">{{ formState.receiptCode }}</span>
                  </div>
                  <div>
                    Ngày mượn:
                    <span class="font-semibold text-blue-600">{{ formState.borrowDate.toISOString().substr(0, 10) }}</span>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-lg text-gray-600">
                    Ngày hẹn trả <span class="text-red-500">*</span>
                  </label>
                  <Input v-model:model-value="formState.returnDate" type="date" class="text-lg p-4 rounded-xl border-2" />
                </div>
                <div class="space-y-2">
                  <label class="text-lg text-gray-600">
                    Địa điểm trả <span class="text-red-500">*</span>
                  </label>
                  <CheckoutLabSearchBox @select="formState.returnLabId = $event" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button class="bg-tertiary-darker text-normal text-white rounded-md p-2 px-4 w-full" @click="submitBorrowForm">
              Xác nhận mượn
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
