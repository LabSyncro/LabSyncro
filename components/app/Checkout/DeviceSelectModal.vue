<script lang="ts" setup>
import type { DeviceKindResourceDto } from '~/lib/api_schema';
import { deviceKindService } from '~/services';

const props = defineProps<{
  id: string | null;
}>();

const emits = defineEmits<{
  'close-modal': [],
}>();

const deviceKindMeta = ref<null | DeviceKindResourceDto>(null);
watch(() => [props.id], async () => {
  if (props.id) {
    deviceKindMeta.value = await deviceKindService.getById(props.id);
    return;
  }
  deviceKindMeta.value = null;
});
</script>

<template>
  <div v-if="deviceKindMeta && id" class="fixed z-50 top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center">
    <div class="bg-white shadow-[0_0px_16px_1px_rgba(0,0,0,0.3)] w-[400px] sm:w-[90vw] p-6">
      <div class="flex justify-between gap-3 items-center">
        <h2 class="text-lg"> {{ deviceKindMeta.name }} </h2>
        <div class="border border-slate text-slate rounded-full flex justify-center items-center p-2 hover:cursor-pointer" @click="emits('close-modal')">
          <Icon class="text-lg" aria-hidden name="i-heroicons-x-mark" />
        </div>
      </div>
      <div class="mt-6">
        <CheckoutDeviceSelectTable :kind-id="id" />
      </div>
    </div>
  </div>
  <div v-else />
</template>
