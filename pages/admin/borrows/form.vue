<script setup lang="ts">
import moment from 'moment';
import { deviceKindService, receiptService, userService } from '~/services';

const route = useRoute();

const currentDeviceKindId = ref<string | null>(null);

const devicesInCart = ref<{
  id: string;
  name: string;
  deviceIds: string[];
}[]>([]);

const selectedDevices = computed(() => devicesInCart.value.flatMap((deviceKind) => deviceKind.deviceIds));

function generateUniqueId (): string {
  const datePrefix = moment().format('YYYYMMDD');
  const randomSuffix = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');
  return `${datePrefix}/${randomSuffix}`;
}

function openModalForDeviceId (id: string) {
  currentDeviceKindId.value = id;
}

function closeModal () {
  currentDeviceKindId.value = null;
}

async function addDevice ({ kind, id }: { kind: string, id: string }) {
  const deviceKind = devicesInCart.value.find(({ id }) => id === kind);
  if (deviceKind) {
    deviceKind.deviceIds.push(id);
    return;
  }
  const deviceKindMeta = await deviceKindService.getById(kind);
  devicesInCart.value.push({
    id: kind,
    name: deviceKindMeta.name,
    deviceIds: [id],
  });
}

function deleteDevice ({ kind, id }: { kind: string, id: string }) {
  const deviceKind = devicesInCart.value.find(({ id }) => id === kind);
  if (!deviceKind) {
    return;
  }
  const index = deviceKind.deviceIds.indexOf(id);
  if (index === -1) {
    return;
  }
  deviceKind.deviceIds.splice(index, 1);
  if (deviceKind.deviceIds.length === 0) {
    const index = devicesInCart.value.findIndex(({ id }) => id === kind);
    devicesInCart.value.splice(index, 1);
  }
}

function deleteDeviceKinds (kindIds: string[]) {
  kindIds.forEach((kindId) => {
    const index = devicesInCart.value.findIndex(({ id }) => kindId === id);
    if (index === -1) return;
    devicesInCart.value.splice(index, 1);
  });
}

const userCodeInput = ref('');
const fullName = ref<null | string>(null);
const role = ref<null | string>(null);
const translatedRole = ref('Vai trò không hợp lệ');
watch(userCodeInput, async () => {
  const isValidUserCode = /^\d{7}$/.test(userCodeInput.value);

  if (isValidUserCode) {
    const userMeta = await userService.getUserById(userCodeInput.value);
    fullName.value = userMeta!.name || null;

    if (!(['student', 'teacher', 'lab_admin'] as (string | undefined)[]).includes(userMeta!.role)) {
      role.value = null;
      translatedRole.value = 'Vai trò không hợp lệ';
    } else {
      role.value = userMeta!.role;
      translatedRole.value = userMeta!.role === 'student' ? 'Sinh viên' : 'Giảng viên';
    }
  } else {
    fullName.value = null;
    role.value = null;
    translatedRole.value = 'Vai trò không hợp lệ';
  }
});
const receiptCodeInput = ref(generateUniqueId());
const now = new Date(Date.now());
const borrowDateInput = ref(now.toISOString().substr(0, 10));
const borrowDate = computed(() => new Date(Date.parse(borrowDateInput.value)));
const borrowLabId = ref<string | null>(null);
const returnDateInput = ref('');
const returnDate = computed(() => new Date(Date.parse(returnDateInput.value)));
const returnLabId = ref<string | null>(null);
function setReturnLabId (id: string) {
  returnLabId.value = id;
}

async function submitReceipt () {
  if (!receiptCodeInput.value || !borrowDate.value || !borrowLabId.value || !returnDate.value || !returnLabId.value || !userCodeInput.value || !devicesInCart.value.length) {
    return;
  }
  await receiptService.submitBorrowRequest({
    receiptId: receiptCodeInput.value,
    borrowDate: borrowDate.value,
    borrowLabId: borrowLabId.value,
    expectedReturnLabId: returnLabId.value,
    expectedReturnDate: returnDate.value,
    borrowerId: userCodeInput.value,
    deviceIds: devicesInCart.value.flatMap(({ deviceIds }) => deviceIds),
  });
  reloadNuxtApp();
}

const handleVirtualKeyboardDetection = async (input: string, type?: 'userId' | 'device') => {
  if (type === 'userId') {
    userCodeInput.value = input;
  } else if (type === 'device') {
    const deviceKindId = input.match(/\/devices\/([a-fA-F0-9]+)/)?.[1];
    const deviceId = input.match(/[?&]id=([a-fA-F0-9]+)/)![1];
    const { id, status } = await deviceService.checkDevice(deviceId, lab.value.id);
    if (status === 'borrowing') {
    } else if (status === 'healthy') {
    }
  }
};

useVirtualKeyboardDetection(handleVirtualKeyboardDetection, {
  userId: { length: 7 },
  device: { pattern: /^https?:\/\/[^/]+\/devices\/\d{8}\?id=[a-fA-F0-9]+$/ },
  scannerThresholdMs: 100,
  maxInputTimeMs: 1000,
});


onMounted(async () => {
  const userId = route.query.userId;
  const deviceKindId = route.query.deviceKindId;
  const deviceId = route.query.deviceId;

  if (userId && typeof userId === 'string') {
    userCodeInput.value = userId;
  }

  if (deviceKindId && deviceId && typeof deviceKindId === 'string' && typeof deviceId === 'string') {
    await addDevice({ kind: deviceKindId, id: deviceId });
  }
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
                  <Input v-model:model-value="userCodeInput" class="text-lg" />
                </div>
                <div v-if="/^\d{7}$/.test(userCodeInput)" class="text-lg">
                  {{ fullName }} | {{ translatedRole }}
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
                    <span class="font-semibold text-blue-600">{{ receiptCodeInput }}</span>
                  </div>
                  <div>
                    Ngày mượn:
                    <span class="font-semibold text-blue-600">{{ borrowDateInput }}</span>
                  </div>
                </div>
              </div>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-lg text-gray-600">
                    Ngày hẹn trả <span class="text-red-500">*</span>
                  </label>
                  <Input v-model:model-value="returnDateInput" type="date" class="text-lg p-4 rounded-xl border-2" />
                </div>
                <div class="space-y-2">
                  <label class="text-lg text-gray-600">
                    Địa điểm trả <span class="text-red-500">*</span>
                  </label>
                  <CheckoutLabSearchBox @select="setReturnLabId" />
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <button class="bg-tertiary-darker text-normal text-white rounded-md p-2 px-4 w-full" @click="submitReceipt">
              Xác nhận mượn
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
