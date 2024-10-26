<script setup lang="ts">
const { activeSidebar, toggleSidebar, activeSection } = useSidebar();

const sections = ['Tất cả người dùng', 'Quản trị viên'];

const setActiveSection = (section: string) => {
  activeSection.value = section;
};
</script>
<template>
  <div>
    <div v-if="activeSidebar === 'simple'" class="w-64 min-h-screen bg-gray-50 p-4 border-r">
      <div class="space-y-1 mb-6">
        <h3 class="text-md text-gray-500 font-normal mb-2">Cá nhân</h3>
        <SettingSidebarItem to="/settings/account">Tài khoản</SettingSidebarItem>
      </div>

      <div class="space-y-1 mb-6">
        <h3 class="text-md text-gray-500 font-normal mb-2">Quản lý người dùng</h3>
        <SettingSidebarItem to="/settings/users">Người dùng</SettingSidebarItem>
        <SettingSidebarItem to="/settings/permissions">Quyền hạn</SettingSidebarItem>
      </div>
    </div>

    <div v-else class="w-64 border-r bg-background p-4 space-y-4">
      <div class="flex items-center space-x-2 mb-6">
        <Button variant="ghost" class="w-full justify-start" @click="toggleSidebar">
          <ChevronLeft class="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <div class="space-y-2">
        <div class="relative">
          <Input placeholder="Search" class="mb-4">
          <template #prefix>
            <Search class="h-4 w-4 text-muted-foreground" />
          </template>
          </Input>
        </div>

        <div v-for="section in sections" :key="section" class="w-full">
          <Button variant="ghost" :class="['w-full justify-start', activeSection === section ? 'bg-accent' : '']"
            @click="setActiveSection(section)">
            <span class="flex items-center">
              {{ section }}
              <Lock class="ml-2 h-3 w-3 text-muted-foreground" />
            </span>
          </Button>
        </div>
      </div>
    </div>

    <Button @click="toggleSidebar" class="mt-4">
      Switch Sidebar
    </Button>
  </div>
</template>
