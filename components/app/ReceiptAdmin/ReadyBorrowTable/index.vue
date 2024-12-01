<script setup lang="ts">
import { receiptService } from '~/services';
import { columns } from './column';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

async function fetchData (offset: number, length: number, options: { desc?: boolean, sortField?: string, searchText?: string, searchFields?: string[] }): Promise<{ data: unknown[], totalPages: number }> {
  const res = await receiptService.getReadyBorrowedDevicesByAdmin(offset, length, { searchText: options.searchText, searchFields: ['device_kind_id', 'device_kind_name', 'place'], sortField: options.sortField as any, desc: options.desc });
  return {
    data: res.devices.map((device) => ({
      ...device,
      image: device.mainImage
    })),
    totalPages: res.totalPages,
  };
}

</script>

<template>
  <DataTable
:selectable="true" :searchable="true" :qrable="true" :fetch-fn="fetchData"
    :columns="columns as AugmentedColumnDef<unknown>[]">
    <template #custom-button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button class="w-full md:w-auto bg-tertiary-dark hover:bg-tertiary-darker text-white">
            <Icon name="i-heroicons-hand-raised" class="w-5 h-5 mr-2" />
            Mượn / Trả
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <DropdownMenuItem class="cursor-pointer" @click="navigateTo('/admin/borrows/form')">
            <div class="flex items-center gap-2">
              <Icon name="i-heroicons-arrow-up-tray" class="w-5 h-5 text-gray-500" />
              <span>Mượn thiết bị</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer" @click="navigateTo('/admin/returns/form')">
            <div class="flex items-center gap-2">
              <Icon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-gray-500" />
              <span>Trả thiết bị</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </DataTable>
</template>
