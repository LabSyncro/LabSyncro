<script setup lang="ts">
import { ArrowLeft, Home, Shield } from 'lucide-vue-next';

definePageMeta({
  layout: 'unauthorized',
});


const router = useRouter();

const goBack = () => {
  router.back();
};

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <div class="container px-4 md:px-6">
    <div class="flex flex-col items-center space-y-4 text-center">
      <div class="space-y-2 grid items-center justify-items-center">
        <Shield class="h-24 w-24 text-muted-foreground opacity-50" />
        <h1 class="text-4xl font-bold tracking-tighter sm:text-5xl">
          Access Denied
        </h1>
        <p class="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
          Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is
          a mistake.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <Button variant="outline" class="space-x-2" @click="goBack">
          <ArrowLeft class="w-4 h-4" />
          <span>Go Back</span>
        </Button>
        <Button class="space-x-2 bg-tertiary-darker " @click="goHome">
          <Home class="w-4 h-4 text-white" />
          <span class="text-white"> Return Home</span>
        </Button>
      </div>
    </div>
  </div>
</template>
