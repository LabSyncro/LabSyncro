<template>
  <div class="min-h-[100vh] bg-gray-100 text-gray-darker">
    <Sidebar />
    <Header />
    <main class="min-h-[80vh]">
      <slot />
    </main>
    <Footer />
  </div>
</template>
