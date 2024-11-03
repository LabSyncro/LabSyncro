<script setup lang="ts">
const route = useRoute();

const { categoryId } = route.query;

const { name: categoryName } = await useFetch(`/api/categories/${categoryId}`).data.value;
</script>

<template>
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
          <p class="text-normal font-bold underline text-black">Cảm biến</p>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <main class="my-10">
    </main>
  </div>
</template>
