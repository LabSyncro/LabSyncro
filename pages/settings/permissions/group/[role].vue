<script setup lang="ts">
definePageMeta({
  middleware: ['permission'],
  layout: 'setting'
});

import { Search, Monitor, ChevronDown } from 'lucide-vue-next';
import { userService } from '@/services';
import type { RoleDetailDto } from '@/lib/api_schema';
import { useToast } from 'vue-toastification';
import { isEqual, sortBy } from 'lodash';

const toast = useToast();
  
const route = useRoute();
const roleKey = route.params.role as string;

const formatResourceTitle = (path: string) => {
  if (path === '/') {
    return 'Home';
  }
  return path
    .split('/')
    .filter(Boolean)
    .map(segment => {
      if (segment.startsWith(':')) {
        return 'Details';
      }
      return segment.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    })
    .join(' - ');
};

const selectedPermissions = ref<string[]>([]);
const roleDetail = ref<RoleDetailDto | undefined>(undefined);

onMounted(async () => {
  roleDetail.value = await userService.getRole(roleKey);

  if (roleDetail.value?.permissions) {
    selectedPermissions.value = roleDetail.value.permissions
      .flatMap(p => p.actions.map(a => `${p.resource}-${a}`));
  }
});

const togglePermission = (resource: string, action: string) => {
  const key = `${resource}-${action}`;
  const index = selectedPermissions.value.indexOf(key);
  if (index === -1) {
    selectedPermissions.value.push(key);
  } else {
    selectedPermissions.value.splice(index, 1);
  }
};

const handleSave = async () => {
  try {
    await userService.updateRolePermissions(roleKey, selectedPermissions.value);
    toast.success('Permissions updated successfully');
  } catch (error) {
    toast.error('Failed to update permissions');
  }
};
</script>

<template>
  <div class="flex min-h-screen">
    <div class="flex-1 p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">{{ roleDetail?.name }}</h1>
        <Button 
          class="bg-tertiary-darker !text-white text-normal w-24 hover:bg-blue-700" 
          size="sm"
          @click="handleSave"
          :disabled="isEqual(sortBy(selectedPermissions), sortBy(roleDetail?.permissions?.flatMap(p => p.actions.map(a => `${p.resource}-${a}`)) || []))"
        >
          Lưu thay đổi
        </Button>
      </div>

      <Tabs default-value="members" class="mb-6">
        <TabsList>
          <TabsTrigger value="members">
            Thành viên ({{ roleDetail?.users?.length || 0 }})
          </TabsTrigger>
          <TabsTrigger value="apps">
            Tài nguyên ({{ roleDetail?.permissions?.filter(p => p.actions.length > 0).length || 0 }})
          </TabsTrigger>
        </TabsList>

        <!-- Members Tab -->
        <TabsContent value="members">
          <div class="flex justify-between items-center mb-4">
            <p class="text-muted-foreground text-sm">
              Hiển thị {{ roleDetail?.users?.length || 0 }} người dùng đã được kích hoạt.
            </p>
            <div class="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline">
                    Tất cả người dùng
                    <ChevronDown class="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    Tất cả người dùng </DropdownMenuItem>
                  <DropdownMenuItem>
                    Được mời </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input placeholder="Tìm kiếm người dùng">
              <template #prefix>
                <Search class="h-4 w-4 text-muted-foreground" />
              </template>
              </Input>
            </div>
          </div>

          <!-- User List -->
          <div class="space-y-4">
              <Card v-for="user in roleDetail?.users" :key="user.id">
              <CardContent class="p-4">
                <div class="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage :src="user.avatar || ''" />
                    <AvatarFallback>{{ user.name.substring(0, 2) }}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 class="font-medium">{{ user.name }}</h3>
                    <p class="text-sm text-muted-foreground">{{ user.email }}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <!-- Resources Tab -->
        <TabsContent value="apps">
          <div class="ml-4 mb-4">
            <div class="flex justify-between items-center">
              <p class="text-muted-foreground text-sm">Tất cả tài nguyên được tìm thấy.</p>
              <div class="flex space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="outline">
                      <span class="text-gray-500 mr-1">Hiển thị</span>
                      <span>Tất cả tài nguyên</span>
                      <ChevronDown class="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <span class="text-gray-500 mr-1">Hiển thị</span>
                      <span>Tất cả tài nguyên</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span class="text-gray-500 mr-1">Hiển thị</span>
                      <span>Tài nguyên có quyền truy cập</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div class="relative">
                  <Search class="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Tìm kiếm tài nguyên" class="pl-8" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-[repeat(3,40px)_1fr] gap-x-2 mb-4">
              <div class="text-sm text-gray-600">Use</div>
              <div class="text-sm text-gray-600">Edit</div>
              <div class="text-sm text-gray-600">Own</div>
              <div />
            </div>
            <ul class="space-y-2">
              <li 
                v-for="perm in roleDetail?.permissions" 
                :key="perm.resource"
                class="grid grid-cols-[repeat(3,40px)_1fr] gap-x-2 items-center"
              >
                <Checkbox
                  v-for="action in ['use', 'edit', 'own']" 
                  :key="action"
                  :checked="selectedPermissions.includes(`${perm.resource}-${action}`)"
                  @update:checked="togglePermission(perm.resource, action)" 
                />
                <div class="flex items-center space-x-2">
                  <Monitor class="h-5 w-5 text-blue-500" />
                  <span>{{ formatResourceTitle(perm.resource) }}</span>
                </div>
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>