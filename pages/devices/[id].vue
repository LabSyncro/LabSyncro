<script setup>
const route = useRoute();

const deviceKindId = computed(() => route.params.id);
</script>

<template>
  <div>
    <div class="mx-16 my-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <NuxtLink href="/" class="flex justify-center items-center text-lg">
              <Icon
                aria-hidden
                name="i-heroicons-home"
              />
            </NuxtLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <p class="font-semibold">/</p>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <NuxtLink class="text-normal text-black" href="/devices">Cảm biến</NuxtLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <p class="font-semibold">/</p>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <NuxtLink class="text-normal font-bold underline text-black"></NuxtLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <main class="mx-16 my-10">
      
    </main>
  </div>
</template>
