<template>
  <div class="mx-6 sm:mx-16 my-10">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <NuxtLink href="/" class="flex justify-center items-center text-lg">
            <Icon aria-hidden name="i-heroicons-home" />
          </NuxtLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <p class="font-semibold">/</p>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <NuxtLink class="text-normal font-bold underline text-black" href="/admin/borrows/form">Mượn thiết bị</NuxtLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <main class="my-10">
      <div class="flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div>
          <div class="bg-white p-4">
            <h2 class="text-lg">Danh sách mượn</h2>

          </div>
        </div>
        <div class="flex flex-col gap-8">
          <div class="bg-white p-4"></div>
        </div>
      </div> 
    </main>
  </div>
</template>
