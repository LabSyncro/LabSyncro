<script setup lang="ts">
interface DeviceData {
  quantity: string
  location: string
  price: string
}

const props = defineProps<{
  isOpen: boolean
  deviceData: DeviceData
}>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  'print': []
  'skip': []
}>()

const formatLocation = (location: string) => {
  const locations: Record<string, string> = {
    'lab1': 'Phòng thí nghiệm 1',
    'lab2': 'Phòng thí nghiệm 2',
    'lab3': 'Phòng thí nghiệm 3'
  }
  return locations[location] || location
}

const handlePrint = () => {
  emit('print')
  emit('update:isOpen', false)
}

const handleSkip = () => {
  emit('skip')
  emit('update:isOpen', false)
}
</script>

<template>
  <Dialog :open="props.isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2">
          <Icon name="i-heroicons-printer" class="w-5 h-5 text-blue-500" />
          In tem định danh
        </DialogTitle>
        <DialogClose />
      </DialogHeader>

      <div class="py-4">
        <p class="text-gray-600 mb-4">
          Bạn có muốn in tem định danh cho các thiết bị vừa thêm?
        </p>

        <div class="space-y-2 text-gray-600">
          <div class="flex items-center gap-2">
            <span class="font-medium">Số lượng thiết bị:</span>
            <span>{{ deviceData.quantity }} cái</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-medium">Địa điểm chứa:</span>
            <span>{{ formatLocation(deviceData.location) }}</span>
          </div>
        </div>

        <p class="text-sm text-gray-500 mt-4 italic">
          Bạn vẫn có thể in sau nếu hiện tại chưa cần thiết.
        </p>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleSkip">
          Bỏ qua
        </Button>
        <Button @click="handlePrint">
          In tem
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
