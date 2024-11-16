<template>
  <div class="md:hidden">
    <img src="" alt="Authentication" width="1280" height="1214" class="block" />
  </div>

  <div
    class="container relative hidden h-[700px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" class="mr-2 h-6 w-6">
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        LabSyncro
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            &ldquo;Let's graduate everyone&rdquo;
          </p>
          <footer class="text-sm">
            Labsyncro Team
          </footer>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <main class="flex-1">
        <slot />
      </main>
    </div>
  </div>
</template>
