<template>
  <div class="min-h-[100vh] bg-slate-light text-gray-darker">
    <div class="flex min-h-screen">
      <SettingSidebar />
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
