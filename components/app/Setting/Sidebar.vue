<script setup lang="ts">
import { ChevronLeft, Lock } from 'lucide-vue-next';

const { activeSidebar, activeSection } = useSidebarSettings();

const sections = [{ name: 'Tất cả người dùng', key: 'all-users' }, { name: 'Quản trị viên', key: 'admin' }];
const router = useRouter();
const route = useRoute();

const activeSidebarType = computed(() => {
  const simplePaths = ['/settings/users', '/settings/permissions', '/settings/account'];
  const path = route.path;

  if (simplePaths.includes(path)) {
    return 'simple';
  } else if (path.startsWith('/settings/permissions/group/')) {
    return 'detailed';
  }
  return 'simple';
});

watchEffect(() => {
  activeSidebar.value = activeSidebarType.value;
  activeSection.value = route.params?.role?.toString() || '';
});

const setActiveSection = (section: string, openNewTab: boolean) => {
  activeSection.value = section;
  const newRoute = `/settings/permissions/group/${section}`;
  if (openNewTab) {
    window.open(newRoute, '_blank');
  } else {
    router.push(newRoute);
  }
};

const handleBackToSimpleSidebar = (openNewTab: boolean) => {
  activeSidebar.value = 'simple';
  const newRoute = '/settings/permissions';
  if (openNewTab) {
    window.open(newRoute, '_blank');
  } else {
    router.push(newRoute);
  }
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

    <div v-else class="w-64 border-r bg-background p-4 space-y-4 min-h-screen">
      <div class="flex items-center space-x-2 mb-6">
        <Button
variant="ghost" class="w-full justify-start"
          @click="(event) => handleBackToSimpleSidebar(!!event.ctrlKey)">
          <ChevronLeft class="mr-2 h-4 w-4" />
          <span class="text-md">Back</span>
        </Button>
      </div>
      <div v-for="section in sections" :key="section.key" class="w-full">
        <Button
variant="ghost" :class="['w-full justify-start', activeSection === section.key ? 'bg-accent' : '']"
          @click="(event) => setActiveSection(section.key, !!event.ctrlKey)">
          <span class="flex items-center text-normal">
            {{ section.name }}
            <Lock class="ml-2 h-3 w-3 text-muted-foreground" />
          </span>
        </Button>
      </div>
    </div>
  </div>
</template>
