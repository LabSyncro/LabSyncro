<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
  userId: string
}>();

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
}>();

const handleBorrow = () => {
  emit('update:isOpen', false);
  navigateTo({
    path: '/admin/borrows/form',
    query: { userId: props.userId }
  });
};

const handleReturn = () => {
  emit('update:isOpen', false);
  navigateTo({
    path: '/admin/returns/form',
    query: { userId: props.userId }
  });
};
</script>

<template>
  <Dialog :open="props.isOpen" @update:open="$emit('update:isOpen', $event)">
    <DialogContent class="max-w-[425px] sm:max-w-[450px] [&>button]:hidden">
      <DialogHeader>
        <DialogTitle class="text-xl">
          Bạn muốn cho mượn hay thu hồi thiết bị?
        </DialogTitle>
      </DialogHeader>

      <div class="grid grid-cols-1 gap-4 py-6" autofocus="false" tabindex="-1">
        <Button
autofocus="false" tabindex="-1" variant="outline"
          class="w-full h-20 text-lg flex items-center justify-center gap-3" @click="handleBorrow">
          <Icon name="i-heroicons-arrow-up-tray" class="w-6 h-6" />
          Mượn thiết bị
        </Button>

        <Button
autofocus="false" tabindex="-1" variant="outline"
          class="w-full h-20 text-lg flex items-center justify-center gap-3" @click="handleReturn">
          <Icon name="i-heroicons-arrow-down-tray" class="w-6 h-6" />
          Thu hồi thiết bị
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
