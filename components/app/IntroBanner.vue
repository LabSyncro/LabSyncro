<script setup lang="ts">
</script>

<template>
  <div class="banner text-white">
    <div class="flex items-center px-10 sm:px-20 md:px-30 lg:px-56 h-[350px]">
      <div class="lg:w-[40vw]">
        <h2 class="text-lg pb-5">
          Phương pháp
          <br>
          Nghiên cứu khoa học
        </h2>
        <div class="text-sm flex flex-col gap-5">
          <p class="line-clamp-6">
            Excepteur efficient emerging, minim veniam anim aute carefully curated Ginza conversation exquisite perfect
            nostrud nisi intricate Content. Qui international first-class nulla ut. Punctual adipisicing, essential
            lovely queen tempor eiusmod irure. Exclusive izakaya charming Scandinavian impeccable aute quality of life
            soft power pariatur Melbourne occaecat discerning.
          </p>
        </div>
        <button class="mt-6 py-2 px-2.5 bg-tertiary-darker text-white text-normal">
          Xem thêm
        </button>
        <div class="mt-8 flex gap-2">
          <button class="flex items-center justify-center rounded-full w-8 h-8 border-[1px] text-white">
            <Icon aria-hidden name="i-heroicons-chevron-left" />
          </button>
          <button class="flex items-center justify-center rounded-full w-8 h-8 border-[1px] text-white">
            <Icon aria-hidden name="i-heroicons-chevron-right" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex gap-1 pb-5 justify-center">
      <div class="h-2 w-2 rounded-full bg-white" />
      <div class="h-2 w-2 rounded-full bg-slate-dark" />
      <div class="h-2 w-2 rounded-full bg-slate-dark" />
      <div class="h-2 w-2 rounded-full bg-slate-dark" />
      <div class="h-2 w-2 rounded-full bg-slate-dark" />
    </div>
  </div>
</template>

<style scoped>
.banner {
  background-image: linear-gradient(0.25turn, #000000, #0000004f), url('/images/mock-intro-banner.png');
}
</style>
