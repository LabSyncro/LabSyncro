<script setup lang="ts">
import { Shield } from 'lucide-vue-next';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b">
      <div class="container flex h-14 items-center">
        <div class="flex items-center space-x-2">
          <Shield class="h-6 w-6" />
          <span class="font-semibold">LabSyncro</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t py-4">
      <div class="container">
        <div class="flex items-center justify-center text-sm text-muted-foreground">
          <p>© {{ new Date().getFullYear() }} LabSyncro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
