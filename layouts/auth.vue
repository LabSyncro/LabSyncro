<template>
  <div class="h-screen flex overflow-hidden">
    <!-- Mobile view -->
    <div class="relative w-full md:hidden">
      <img 
        src="/images/auth-layout.png" 
        alt="Authentication Background" 
        class="absolute inset-0 object-cover w-full h-full opacity-20"
      >
      <div class="relative z-10 w-full h-full flex flex-col">
        <div class="flex items-center justify-center p-4">
          <svg
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round" 
            class="h-8 w-8 text-tertiary-darker"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          <span class="ml-2 text-xl font-bold">LabSyncro</span>
        </div>
        <main class="flex-1 flex items-center justify-center px-4">
          <slot />
        </main>
      </div>
    </div>

    <!-- Desktop view -->
    <div class="hidden md:flex w-full h-full">
      <div class="relative hidden md:block md:w-1/2">
        <img
          src="/images/auth-layout.png"
          alt="Authentication Background"
          class="absolute inset-0 object-cover w-full h-full"
        >
        <div class="absolute inset-0" />
      </div>
      <div class="w-full md:w-1/2 flex items-center justify-center">
        <main class="w-full">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>
