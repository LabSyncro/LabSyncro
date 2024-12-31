<script setup lang='ts'>
definePageMeta({
  middleware: ['permission'],
  layout: 'setting'
});

import { Check, ChevronDown, Search, MoreVertical } from 'lucide-vue-next';
import type { UserResourceDto } from '@/lib/api_schema';
import { userService } from '@/services';

const formatLastActive = (date: Date) => {
  if (!date) return 'Chưa hoạt động';
  
  const lastActive = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastActive.getTime());
  const diffSeconds = Math.floor(diffTime / 1000);
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffSeconds < 60) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 30) return `${diffDays} ngày trước`;
  return lastActive.toLocaleDateString('vi-VN');
};

const getUserInitials = (name: string) => {
  if (!name) return '??';
  
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

const getRoleBadgeStyle = (roleKey: string) => {
  switch (roleKey) {
    case 'admin':
      return 'bg-green-100 text-green-600 hover:bg-green-600 hover:text-white';
    case 'lab_admin':
      return 'bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white';
    case 'teacher':
      return 'bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white';
    case 'student':
      return 'bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white';
    default:
      return 'bg-gray-200 text-gray-600 hover:bg-gray-600 hover:text-white';
  }
};

const users = ref<UserResourceDto[]>([]);

onMounted(async () => {
  users.value = await userService.getUsers();
});
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Người dùng</h1>

      <div class="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              Tất cả người dùng: ({{ users?.length || 0 }})
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Tất cả người dùng</DropdownMenuItem>
            <DropdownMenuItem>Đã mời</DropdownMenuItem>
            <DropdownMenuItem>Đang chờ xác nhận</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem class="flex items-center justify-between">
              <span>Ẩn người dùng bị vô hiệu hóa</span>
              <Check class="h-4 w-4 text-gray-500 ml-2" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              Sắp xếp theo tên
              <ChevronDown class="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Tên</DropdownMenuItem>
            <DropdownMenuItem>Hoạt động gần nhất</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input class="pl-10 w-[250px]" placeholder="Tìm kiếm người dùng" />
        </div>

        <Button class="bg-tertiary-darker !text-white text-normal w-24 hover:bg-blue-700" size="sm">Mời</Button>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="icon">
              <MoreVertical class="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Xuất danh sách người dùng</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <div class="text-sm text-gray-500 mb-4">
      Hiện {{ users?.length || 0 }} người dùng đang hoạt động.
    </div>

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên</TableHead>
          <TableHead>Quyền hạn</TableHead>
          <TableHead>Lần hoạt động cuối</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="user in users" :key="user.id">
          <TableCell>
            <div class="flex items-center gap-3">
              <Avatar>
                <AvatarImage :src="user.avatar || ''" />
                <AvatarFallback>{{ getUserInitials(user.name) }}</AvatarFallback>
              </Avatar>
              <div>
                <div class="font-medium">{{ user.name }}</div>
                <div class="text-sm text-gray-500">{{ user.email }}</div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div class="flex gap-2">
              <Badge 
                v-for="role in user.roles" 
                :key="role.key"
                :class="getRoleBadgeStyle(role.key)"
                class="cursor-pointer"
              >
                {{ role.name }}
              </Badge>
            </div>
          </TableCell>
          <TableCell>{{ formatLastActive(user.last_active_at) }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
