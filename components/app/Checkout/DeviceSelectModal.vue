<script lang="ts" setup>
import { deviceKindService } from '~/services';

const props = defineProps<{
  id: string;
}>();

const deviceKindMeta = await deviceKindService.getById(props.id);
</script>

<template>
  <div class="fixed z-50 top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center">
    <div class="bg-white shadow-[0_0px_16px_1px_rgba(0,0,0,0.3)] w-[400px] sm:w-[90vw] p-6">
      <div class="flex justify-between gap-3 items-center">
        <h2 class="text-lg"> {{ deviceKindMeta.name }} </h2>
        <div class="border border-slate text-slate rounded-full flex justify-center items-center p-2">
          <Icon class="text-lg" aria-hidden name="i-heroicons-x-mark" />
        </div>
      </div>
    </div>
  </div>
</template>
