<script setup lang="ts">
const { isOpen, closeSidebar } = useSidebar();
</script>

<template>
  <div>
    <div
v-if="isOpen" class="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
      :class="{ 'opacity-100': isOpen, 'opacity-0 pointer-events-none': !isOpen }" @click="closeSidebar" />

    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col transform transition-transform duration-300"
      :class="isOpen ? 'translate-x-0' : '-translate-x-full'">
      <div class="flex items-center justify-between p-4">
        <div class="flex items-center gap-2">
          <Icon name="i-heroicons-beaker" class="w-8 h-8 text-blue-600" />
          <span class="text-xl font-semibold text-blue-600">Lab Syncro</span>
        </div>
        <Button variant="ghost" size="icon" @click="closeSidebar">
          <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
        </Button>
      </div>

      <div class="flex-1 flex flex-col justify-between p-4">
        <div class="space-y-8">
          <SidebarSection title="TỔNG QUAN">
            <SidebarLink to="/dashboard" icon="i-heroicons-chart-pie">
              Dashboard
            </SidebarLink>
            <SidebarLink to="/admin/devices" icon="i-heroicons-cpu-chip">
              Danh sách thiết bị
            </SidebarLink>
            <SidebarLink to="/labs" icon="i-heroicons-beaker">
              Danh sách phòng thí nghiệm
            </SidebarLink>
          </SidebarSection>
          <SidebarSection title="VẬN HÀNH">
            <SidebarLink to="/admin/receipts" icon="i-heroicons-hand-raised">
              Mượn / Trả
            </SidebarLink>
          </SidebarSection>
        </div>
        <SidebarProfile />
      </div>
    </aside>
  </div>
</template>

<style scoped>
.fixed {
  will-change: transform, opacity;
}
</style>
