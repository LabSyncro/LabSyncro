<script setup lang="ts">
definePageMeta({
  middleware: ['permission']
});
</script>

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
          <p class="text-normal font-bold underline text-black">Danh sách mượn</p>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <main class="my-10 min-h-screen flex-1 bg-white p-4">
      <Tabs default-value="borrow">
        <TabsList class="flex items-start justify-start gap-4 bg-white mb-8">
          <TabsTrigger value="borrow">
            Đang mượn
          </TabsTrigger>
          <TabsTrigger value="return">
            Đã trả
          </TabsTrigger>
        </TabsList>
        <TabsContent value="borrow">
          <BorrowReturnDeviceTable />
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>
