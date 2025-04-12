<template>
  <div
    class="min-h-screen relative bg-gradient-to-b from-primary-darker/10 to-gray-100 flex items-center justify-center p-4 overflow-hidden"
  >
    <div class="absolute inset-0 z-0">
      <div
        class="absolute inset-0 opacity-[0.02]"
        style="
          background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
        "
      ></div>
    </div>

    <div class="relative z-10 w-full h-screen md:h-auto">
      <div class="container mx-auto max-w-lg mb-6">
        <div class="flex items-center justify-center gap-2 text-primary-darker">
          <div class="h-8 w-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <rect x="7" y="7" width="3" height="3"></rect>
              <rect x="14" y="7" width="3" height="3"></rect>
              <rect x="7" y="14" width="3" height="3"></rect>
              <rect x="14" y="14" width="3" height="3"></rect>
            </svg>
          </div>
          <h1 class="text-2xl font-bold">LabSyncro</h1>
        </div>
      </div>

      <slot />

      <div class="container mx-auto max-w-lg mt-6">
        <div class="text-center text-sm text-gray-500">
          <p>© {{ new Date().getFullYear() }} LabSyncro. Bảo mật và an toàn.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.relative {
  transition: all 0.3s ease-in-out;
}

.bg-gradient-to-b {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
</style>
