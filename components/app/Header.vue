<script setup lang="ts">
const { openSidebar } = useSidebar();
</script>

<template>
  <div>
    <div class="bg-primary-darker px-4 py-9 lg:px-16" role="banner">
      <div class="flex md:hidden mb-10 justify-between items-center">
        <Button variant="ghost" size="icon" class="text-white border-2 border-slate-500" @click="openSidebar">
          <Icon name="i-heroicons-bars-3" class="w-6 h-6" />
        </Button>
        <Logo />
        <Avatar />
      </div>

      <div class="flex gap-8 justify-between">
        <div class="grow-[1] hidden md:flex items-center gap-4">
          <Button variant="ghost" size="icon" class="text-white border-2 border-slate-500" @click="openSidebar">
            <Icon name="i-heroicons-bars-3" class="w-6 h-6" />
          </Button>
          <Logo />
        </div>
        <div class="flex items-stretch justify-between gap-4 grow-[3]">
          <DeviceSearchBox class="flex-1" />
          <QrButton />
        </div>
        <div class="my-auto hidden md:flex grow-[2] gap-3 justify-end">
          <Avatar />
        </div>
      </div>
    </div>
    <NavBar />
  </div>
</template>
