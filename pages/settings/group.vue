<script setup lang="ts">
import {
  ChevronLeft,
  Lock,
  Search,
  FolderIcon,
  WindIcon,
  PuzzleIcon
} from 'lucide-vue-next';

definePageMeta({
  layout: 'setting'
});


const activeSection = ref('all-users');
const userFilter = ref('all');
const appFilter = ref('all');

const appsTree = ref([
  {
    name: 'archive',
    type: 'folder',
    children: [
      { name: 'SiFi Order Entry System', type: 'app' },
      { name: 'Untitled', type: 'app' }
    ]
  },
  {
    name: 'Deprecated',
    type: 'folder',
    children: [
      { name: 'Appointments', type: 'app' },
      { name: 'Coextro Portal', type: 'app' },
      { name: 'Coextro Portal - copy', type: 'app' },
      { name: 'Service Requests', type: 'app' }
    ]
  },
  {
    name: 'Retoolers',
    type: 'folder',
    children: [
      { name: 'Addresses - Retoolers', type: 'app' },
      { name: 'Appointments - Retoolers', type: 'app' },
      { name: 'Customers', type: 'app' },
      { name: 'Service Requests - Retoolers', type: 'app' }
    ]
  },
  {
    name: 'modules',
    type: 'folder',
    children: [
      { name: 'create_appointment_modal', type: 'module' },
      { name: 'create_service_order_modal', type: 'module' },
      { name: 'navbar', type: 'module' },
      { name: 'sidebar', type: 'module' }
    ]
  }
]);
</script>

<template>
  <div class="flex min-h-screen">
    <!-- Sidebar -->
    <div class="w-64 border-r bg-background p-4 space-y-4">
      <div class="flex items-center space-x-2 mb-6">
        <Button variant="ghost" class="w-full justify-start">
          <ChevronLeft class="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div class="space-y-2">
        <Input placeholder="Search" class="mb-4">
        <template #prefix>
          <Search class="h-4 w-4 text-muted-foreground" />
        </template>
        </Input>

        <Button
variant="ghost" :class="[
          'w-full justify-start',
          activeSection === 'all-users' ? 'bg-accent' : ''
        ]" @click="activeSection = 'all-users'">
          <span class="flex items-center">
            All Users
            <Lock class="ml-2 h-3 w-3 text-muted-foreground" />
          </span>
        </Button>

        <Button
variant="ghost" :class="[
          'w-full justify-start',
          activeSection === 'admin' ? 'bg-accent' : ''
        ]" @click="activeSection = 'admin'">
          <span class="flex items-center">
            Admin
            <Lock class="ml-2 h-3 w-3 text-muted-foreground" />
          </span>
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <div class="flex justify-between items-center mb-6">
        <div class="flex items-center space-x-2">
          <h1 class="text-2xl font-semibold">All Users</h1>
          <Badge variant="secondary" class="flex items-center">
            <Lock class="mr-1 h-3 w-3" />
            Default group
          </Badge>
        </div>
        <Button>Save changes</Button>
      </div>

      <!-- Tabs -->
      <Tabs default-value="members" class="mb-6">
        <TabsList>
          <TabsTrigger value="members">
            Members (1)
          </TabsTrigger>
          <TabsTrigger value="apps">
            Apps (All)
          </TabsTrigger>
          <TabsTrigger value="resources">
            Resources (All)
          </TabsTrigger>
          <TabsTrigger value="workflows">
            Workflows (All)
          </TabsTrigger>
          <TabsTrigger value="additional">
            Additional
          </TabsTrigger>
        </TabsList>

        <!-- Members Tab -->
        <TabsContent value="members">
          <div class="flex justify-between items-center mb-4">
            <p class="text-muted-foreground">
              Showing 1 enabled user.
            </p>
            <div class="flex space-x-2">
              <Select v-model="userFilter">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="All users (1)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All users (1)</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Search for a user">
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
                  <AvatarImage src="/api/placeholder/32/32" />
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
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-4">
              <p class="text-muted-foreground">Matched all apps.</p>
              <div class="flex items-center space-x-2">
                <span>Use</span>
                <span>Edit</span>
                <span>Own</span>
                <span class="flex items-center">
                  Assigned all apps, and all folders
                  <Lock class="ml-1 h-3 w-3" />
                </span>
              </div>
            </div>
            <div class="flex space-x-2">
              <Select v-model="appFilter">
                <SelectTrigger class="w-[180px]">
                  <SelectValue placeholder="All apps" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All apps</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Search for an app or folder">
              <template #prefix>
                <Search class="h-4 w-4 text-muted-foreground" />
              </template>
              </Input>
              <Button variant="outline">Collapse all folders</Button>
              <Button variant="outline">Folder permission</Button>
            </div>
          </div>

          <!-- Apps Tree -->
          <Card>
            <CardContent class="p-4">
              <Tree :items="appsTree" :indent="24" class="border-none">
                <template #default="{ item }">
                  <div class="flex items-center">
                    <Checkbox v-if="item.type !== 'folder'" class="mr-2" />
                    <FolderIcon v-if="item.type === 'folder'" class="mr-2 h-4 w-4 text-muted-foreground" />
                    <WindIcon v-else-if="item.type === 'app'" class="mr-2 h-4 w-4 text-muted-foreground" />
                    <PuzzleIcon v-else class="mr-2 h-4 w-4 text-muted-foreground" />
                    {{ item.name }}
                  </div>
                </template>
              </Tree>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
