<script setup lang="ts">
import { Search, Filter, ScanQrCode } from 'lucide-vue-next';

const searchQuery = ref('');

const labs = ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4', 'Lab 5'];
const facilities = ['Facility 1', 'Facility 2', 'Facility 3'];
const selectedLab = ref('');
const selectedFacility = ref('');
</script>

<template>
  <div class="flex items-center gap-4 max-w-[600px] mb-6">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" class="flex items-center gap-2">
          <Filter class="w-5 h-5" />
          <span>Bộ lọc</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-[300px] p-4">
        <div class="flex flex-col gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Phòng thí nghiệm</label>
            <Select v-model="selectedLab">
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng thí nghiệm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="lab in labs" :key="lab" :value="lab">
                  {{ lab }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Cơ sở</label>
            <Select v-model="selectedFacility">
              <SelectTrigger>
                <SelectValue placeholder="Chọn cơ sở" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="facility in facilities" :key="facility" :value="facility">
                  {{ facility }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button class="w-full mt-2">Áp dụng</Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>

    <div class="flex-1 relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <Input v-model="searchQuery" type="text" placeholder="Tìm kiếm" class="pl-10" />
    </div>

    <Button variant="ghost" size="icon">
      <ScanQrCode class="w-5 h-5" />
    </Button>
  </div>
</template>
