<script setup lang="ts">
interface AddDeviceForm {
  quantity: string
  location: string
  price: string
}

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'submit': [form: AddDeviceForm]
}>();

const showPrintModal = ref(false)

const form = reactive<AddDeviceForm>({
  quantity: '',
  location: '',
  price: ''
});

const resetForm = () => {
  form.quantity = ''
  form.location = ''
  form.price = ''
}

const handleSubmit = () => {
  //emit('submit', { ...form });
  //emit('update:isOpen', false);

  showPrintModal.value = true
};

const handlePrint = () => {
  console.log('Printing labels...')
  resetForm()
}

const handleSkip = () => {
  console.log('Skipping print...')
  resetForm()
}
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
              <UiSelectValue placeholder="Chọn phòng thí nghiệm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lab1">Phòng thí nghiệm 1</SelectItem>
              <SelectItem value="lab2">Phòng thí nghiệm 2</SelectItem>
              <SelectItem value="lab3">Phòng thí nghiệm 3</SelectItem>
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
        <Button variant="outline" @click="$emit('update:isOpen', false)">
          Hủy
        </Button>
        <Button type="submit" @click="handleSubmit">
          Xác nhận
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>

  <DeviceNewPrintQRCode v-model:isOpen="showPrintModal" :device-data="form" @print="handlePrint" @skip="handleSkip" />
</template>
