<script setup lang="ts">
import { columns } from '~/components/app/DeviceTable/column';
import type { AdminDeviceList } from '~/components/app/DeviceTable/schema';

const data = ref<AdminDeviceList[]>([]);
</script>

<template>
  <div>
    <DeviceTable :columns="columns" :data="data" />
  </div>
</template>
