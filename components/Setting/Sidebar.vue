<template>
  <div class="w-64 min-h-screen bg-gray-50 p-4 border-r">
    <!-- Personal Section -->
    <div class="space-y-1 mb-6">
      <h3 class="text-md text-gray-500 font-normal mb-2">Cá nhân</h3>
      <SettingSidebarItem to="/settings/account">Tài khoản</SettingSidebarItem>
    </div>

    <!-- User Management Section -->
    <div class="space-y-1 mb-6">
      <h3 class="text-md text-gray-500 font-normal mb-2">Quản lý người dùng</h3>
      <SettingSidebarItem to="/settings/users">Người dùng</SettingSidebarItem>
      <SettingSidebarItem to="/settings/permissions">Quyền hạn</SettingSidebarItem>
    </div>
  </div>
</template>
