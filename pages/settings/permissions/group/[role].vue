<script setup lang="ts">
definePageMeta({
  middleware: ['permission'],
  layout: 'setting'
});

import { Search, Monitor, ChevronDown } from 'lucide-vue-next';
  
const route = useRoute();

const roleTitles: { [key: string]: string } = {
  'all-users': 'Tất cả người dùng',
  'admin': 'Quản trị viên',
};


const apps = ref([
  'Home Page',
  'Restocking Page',
  'Tracking Devices Page',
  'Category Management Page',
  'Import Page',
  'Inventory Page',
  'Performance Monitor Page',
  'Repricing Page',
  'User Management Page',
  'Warehouse Page'
]);

const selectedApps = ref<string[]>([]);

const headingTitle = computed(() => {
  const role = route.params?.role?.toString();
  return roleTitles[role] || 'Không xác định';
});


const toggleApp = (app: string, column: number) => {
  const key = `${app}-${column}`;
  const index = selectedApps.value.indexOf(key);
  if (index === -1) {
    selectedApps.value.push(key);
  } else {
    selectedApps.value.splice(index, 1);
  }
};
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Main Content -->
    <div class="flex-1 p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold">{{ headingTitle }}</h1>
        <Button class="bg-tertiary-darker !text-white text-normal w-24 hover:bg-blue-700" size="sm">
          Lưu thay đổi
        </Button>
      </div>

      <!-- Tabs -->
      <Tabs default-value="members" class="mb-6">
        <TabsList>
          <TabsTrigger value="members">
            Thành viên (1)
          </TabsTrigger>
          <TabsTrigger value="apps">
            Tài nguyên (Tất cả)
          </TabsTrigger>
        </TabsList>

        <!-- Members Tab -->
        <TabsContent value="members">
          <div class="flex justify-between items-center mb-4">
            <p class="text-muted-foreground text-sm">
              Hiển thị 1 người dùng đã được kích hoạt. </p>
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
          <Card>
            <CardContent class="p-4">
              <div class="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://avatars.githubusercontent.com/u/111476687?v=4" />
                  <AvatarFallback>PN</AvatarFallback>
                </Avatar>
                <div>
                  <h3 class="font-medium">PHÚ NGUYÊN NGỌC</h3>
                  <p class="text-sm text-muted-foreground">phu.nguyen2310@hcmut.edu.vn</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <!-- Apps Tab -->
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
              <li v-for="app in apps" :key="app" class="grid grid-cols-[repeat(3,40px)_1fr] gap-x-2 items-center">
                <Checkbox :checked="selectedApps.includes(`${app}-0`)" @click="toggleApp(app, 0)" />
                <Checkbox :checked="selectedApps.includes(`${app}-1`)" @click="toggleApp(app, 1)" />
                <Checkbox :checked="selectedApps.includes(`${app}-2`)" @click="toggleApp(app, 2)" />
                <div class="flex items-center space-x-2">
                  <Monitor class="h-5 w-5 text-blue-500" />
                  <span>{{ app }}</span>
                </div>
              </li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
