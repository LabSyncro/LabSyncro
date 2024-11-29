<script setup lang="ts">
import { laboratoryService } from '~/services';

interface AddDeviceForm {
  quantity: string
  location: string
  price: string
}

const props = defineProps<{
  isOpen: boolean,
  deviceKindId: string,
  deviceKindName: string
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'submit': [form: AddDeviceForm]
}>();

const showPrintModal = ref(false);

const form = reactive<AddDeviceForm>({
  quantity: '',
  location: '',
  price: ''
});

const resetForm = () => {
  form.quantity = '';
  form.location = '';
  form.price = '';
};

const handleSubmit = () => {
  //emit('submit', { ...form });
  //emit('update:isOpen', false);

  showPrintModal.value = true;
};

const handlePrint = () => {
  resetForm();
};

const handleSkip = () => {
  resetForm();
};

const labs = ref<{ id: string, name: string; room: string; branch: string }[]>([]);

onMounted(async () => {
  const data = (await laboratoryService.getAllLabs({})).labs;
  labs.value = data;
});

</script>

<template>
  <Dialog :open="props.isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Thêm thiết bị</DialogTitle>
        <DialogClose />
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div class="space-y-2">
          <label class="text-sm text-gray-600">
            Số lượng <span class="text-red-500">*</span>
          </label>
          <Input v-model="form.quantity" type="number" placeholder="Nhập số lượng" />
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gray-600">
            Địa điểm chứa <span class="text-red-500">*</span>
          </label>
          <Select v-model="form.location">
            <SelectTrigger>
              <SelectValue placeholder="Chọn phòng thí nghiệm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="lab in labs" :key="lab.id" :value="`${lab.room}, ${lab.branch}`">
                <div class="flex flex-col items-start">
                  <span>{{ lab.name }}</span>
                  <span class="text-sm text-gray-500">{{ lab.room }}, {{ lab.branch }}</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Đơn giá nhập -->
        <div class="space-y-2">
          <label class="text-sm text-gray-600">
            Đơn giá nhập (VND / cái)
          </label>
          <Input v-model="form.price" type="number" placeholder="Nhập đơn giá" />
        </div>
      </div>

      <DialogFooter>
        <div class="flex items-center justify-between w-full">
          <Button variant="outline" @click="$emit('update:isOpen', false)">
            Hủy
          </Button>
          <Button type="submit" class="bg-tertiary-dark hover:bg-tertiary-darker" @click="handleSubmit">
            Xác nhận
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <DeviceNewPrintQRCode
v-model:is-open="showPrintModal" :device-data="{ ...form, deviceKindId, deviceKindName }"
    @print="handlePrint" @skip="handleSkip" />
</template>
