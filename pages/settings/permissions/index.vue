<script setup lang="ts">
definePageMeta({
  middleware: ['permission'],
  layout: 'setting'
});

import { Search } from 'lucide-vue-next';
import { userService } from '@/services';
import type { RoleWithStatsDto } from '@/lib/api_schema';

const { activeSection, activeSidebar } = useSidebarSettings();
const router = useRouter();

const handleRowClick = (rowKey: string, openNewTab: boolean) => {
  const newRoute = `/settings/permissions/group/${rowKey}`;
  if (openNewTab) {
    window.open(newRoute, '_blank');
  } else {
    activeSection.value = rowKey;
    activeSidebar.value = 'detailed';
    router.push(newRoute);
  }
};

const permissions = ref<RoleWithStatsDto[]>([]);

onMounted(async () => {
  permissions.value = await userService.getRoles();
});
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Nhóm Quyền truy cập</h1>
      <div class="flex items-center gap-4">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input class="pl-10 w-[300px]" placeholder="Tìm kiếm người dùng" />
        </div>
        <Button class="bg-tertiary-darker !text-white text-normal w-24 hover:bg-blue-700" size="sm">
          Tạo mới
        </Button>
      </div>
    </div>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead class="w-[200px]">Tên</TableHead>
          <TableHead>Tài nguyên</TableHead>
          <TableHead>Người dùng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="row in permissions" :key="row.key">
          <TableCell
            class="font-medium cursor-pointer hover:text-tertiary-darker"
            @click="(event) => handleRowClick(row.key, !!event.ctrlKey)"
          >
          <span>{{ row.name }}</span>
          </TableCell>
          <TableCell class="text-muted-foreground">{{ row.resources }}</TableCell>
          <TableCell>
            <div class="flex items-center space-x-2">
              <span class="text-blue-600">{{ row.users }}</span>
              <div class="flex -space-x-2">
                <Avatar v-for="(avatar, index) in row.avatarUrl.slice(0,3)" 
                       :key="index"
                       class="h-6 w-6 ring-2 ring-background">
                  <AvatarImage :src="avatar" />
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                <Avatar v-if="row.avatarUrl.length > 3"
                       class="h-6 w-6 bg-tertiary-darker text-white ring-2 ring-background">
                  <AvatarFallback>+{{ row.avatarUrl.length - 3 }}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
