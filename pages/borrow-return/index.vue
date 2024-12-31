<script setup lang="ts">
definePageMeta({
  middleware: ['permission']
});

import { receiptService } from '~/services';

const borrowCount = ref(0);
const returnCount = ref(0);

onMounted(async () => {
  borrowCount.value = await receiptService.getTotalBorrowedItems({});
  returnCount.value = await receiptService.getTotalReturnedItems({});
});

</script>

<template>
  <div class="mx-6 sm:mx-16 my-10">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <NuxtLink href="/" class="flex justify-center items-center text-lg hover:text-primary-darker transition-colors">
            <Icon aria-hidden name="i-heroicons-home" />
          </NuxtLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <p class="font-semibold text-gray-400">/</p>
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <p class="text-normal font-bold text-primary-darker hover:underline cursor-pointer">Danh sách mượn</p>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <main class="my-10 min-h-screen flex-1 bg-white p-6 rounded-lg shadow-sm">
      <Tabs default-value="borrow" class="w-full">
        <TabsList class="flex items-center justify-start gap-6 bg-white mb-8">
          <TabsTrigger value="borrow" class="px-4 py-2 text-normal font-medium hover:text-primary-darker transition-colors">
            Đang mượn ({{ borrowCount }})
          </TabsTrigger>
          <TabsTrigger value="return" class="px-4 py-2 text-normal font-medium hover:text-primary-darker transition-colors">
            Đã trả ({{ returnCount }})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="borrow" class="focus:outline-none">
          <BorrowDeviceTable  />
        </TabsContent>
        <TabsContent value="return" class="focus:outline-none">
          <ReturnDeviceTable />
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>
