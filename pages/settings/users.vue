<script setup lang='ts'>
import { ref } from 'vue';
import {
  Check,
  ChevronDown,
  Search,
  MoreVertical
} from 'lucide-vue-next';

definePageMeta({
  layout: 'setting'
});

const users = ref([
  {
    id: 1,
    name: 'PHÚ NGUYỄN NG...',
    email: 'phu.nguyen2310@hcmut.edu...',
    avatar: '/path-to-avatar.jpg',
    permissions: ['admin', 'All Users'],
    lastActive: '5 days ago'
  }
]);

const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .substring(0, 2);
};
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold">Người dùng</h1>

      <div class="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">
              Tất cả người dùng: ({{ users.length }})
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

        <Button>Mời</Button>

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
      Hiện {{ users.length }} người dùng đang hoạt động.
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
                <AvatarImage :src="user.avatar" />
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
              <Badge variant="secondary">Quản trị viên</Badge>
              <Badge variant="secondary">Tất cả người dùng</Badge>
            </div>
          </TableCell>
          <TableCell>{{ user.lastActive }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>
