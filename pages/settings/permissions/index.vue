<script setup lang="ts">
definePageMeta({
  middleware: ['permission']
});

import { Lock, Search } from 'lucide-vue-next';
import { ref } from 'vue';

definePageMeta({
  layout: 'setting',
});

const permissions = ref([
  {
    name: 'Tất cả người dùng',
    key: 'all-users',
    resources: '21 (Tất cả)',
    users: 1,
    avatarUrl: 'https://avatars.githubusercontent.com/u/111476687?v=4'
  },
  {
    name: 'Quản trị viên',
    key: 'admin',
    resources: '21 (Tất cả)',
    users: 1,
    avatarUrl: 'https://avatars.githubusercontent.com/u/111476687?v=4'
  }
]);

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
        <TableRow v-for="row in permissions" :key="row.name">
          <TableCell
class="font-medium cursor-pointer hover:text-tertiary-darker"
            @click="(event) => handleRowClick(row.key, !!event.ctrlKey)">
            <div class="flex items-center space-x-2">
              <span>{{ row.name }}</span>
              <Lock class="h-4 w-4 text-muted-foreground" />
            </div>
          </TableCell>
          <TableCell class="text-muted-foreground">{{ row.resources }}</TableCell>
          <TableCell>
            <div class="flex items-center space-x-2">
              <span class="text-blue-600">{{ row.users }}</span>
              <Avatar class="h-6 w-6">
                <AvatarImage :src="row.avatarUrl" />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
