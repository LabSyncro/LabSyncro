<script lang="ts" setup>
import type { DeviceKindResourceDto } from '~/lib/api_schema';
import { deviceKindService } from '~/services';

const props = defineProps<{
  kindId: string | null;
  selectedDevices: string[];
}>();

const { lab } = useLab();

const emits = defineEmits<{
  'close-modal': [],
  'device-add': [{ kind: string, id: string }],
  'device-delete': [{ kind: string, id: string }],
}>();

const deviceKindMeta = ref<null | DeviceKindResourceDto>(null);
watch(() => [props.kindId], async () => {
  if (props.kindId) {
    deviceKindMeta.value = await deviceKindService.getById(props.kindId, lab.value.id);
    return;
  }
  deviceKindMeta.value = null;
});
</script>

<template>
  <div
v-if="deviceKindMeta && kindId"
    class="fixed z-50 top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center">
    <div class="bg-white shadow-[0_0px_16px_1px_rgba(0,0,0,0.3)] w-[400px] sm:w-[90vw] p-6">
      <div class="flex justify-between gap-3 items-center">
        <h2 class="text-lg"> {{ deviceKindMeta.name }} </h2>
        <div
          class="border border-slate text-slate rounded-full flex justify-center items-center p-2 hover:cursor-pointer"
          @click="emits('close-modal')">
          <Icon class="text-lg" aria-hidden name="i-heroicons-x-mark" />
        </div>
      </div>
      <div class="mt-6">
        <CheckoutDeviceSelectTable
:selected-devices="selectedDevices" :kind-id="kindId"
          @device-add="(id) => emits('device-add', { kind: props.kindId!, id })"
          @device-delete="(id) => emits('device-delete', { kind: props.kindId!, id })" />
      </div>
    </div>
  </div>
  <div v-else />
</template>
