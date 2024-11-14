<script setup lang="ts">
import { userService } from '@/services';
import { ChevronDown } from 'lucide-vue-next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const avatar = ref<null | string>(null);

onMounted(async () => {
  avatar.value = await userService.getAvatar();
});
</script>

<template>
  <div class="relative">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div class="flex items-center cursor-pointer">
          <div class="h-9 w-9 rounded-full border-slate-dark border-[2px] bg-primary-lighter relative">
            <img class="h-[100%] aspect-auto inline-block rounded-full" :src="avatar || ''" alt="User's avatar">
            <div class="w-3 h-3 absolute bg-safe-darker rounded-full z-50 border-white border-[2px] top-6 right-[-2px]"
              aria-hidden />
          </div>
          <ChevronDown class="h-4 w-4 ml-2 text-gray-500" :stroke-width="3" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent class="w-56">
        <div class="flex items-center p-2 border-b">
          <div class="h-8 w-8 rounded-full bg-gray-200 mr-2">
            <img :src="avatar || ''" class="h-full w-full rounded-full" alt="User's avatar">
          </div>
          <div class="flex flex-col">
            <span class="text-md font-medium">Phu Nguyen</span>
            <span class="text-normal text-gray-500">Quản trị viên</span>
          </div>
        </div>

        <NuxtLink href="/settings/users">
          <DropdownMenuItem class="cursor-pointer">
            <span class="text-normal">Cài đặt</span>
          </DropdownMenuItem>
        </NuxtLink>

        <DropdownMenuItem class="text-red-600 cursor-pointer hover:!bg-red-400">
          <span class="text-normal">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
