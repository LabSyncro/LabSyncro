<script setup lang="ts">
import { receiptService } from '~/services';

const totalBorrowedDevices = ref(0);
const totalReturnedDevices = ref(0);
const totalReadyBorrowDevices = ref(0);

onMounted(async () => {
  totalBorrowedDevices.value = await receiptService.getTotalBorrowedItemsByAdmin({});
  totalReadyBorrowDevices.value = await receiptService.getTotalReadyBorrowedItemsByAdmin({});
  totalReturnedDevices.value = await receiptService.getTotalReturnedItemsByAdmin({});
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
          <p class="text-normal font-bold underline text-black">Mượn trả</p>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
    <main class="my-10 min-h-screen flex-1 bg-white p-4">
      <Tabs default-value="ready-borrow">
        <TabsList class="flex items-start justify-start gap-4 bg-white mb-8">
          <TabsTrigger value="ready-borrow">
            Sẵn dàng cho mượn ({{ totalReadyBorrowDevices }})
          </TabsTrigger>
          <TabsTrigger value="borrow">
            Đang mượn ({{ totalBorrowedDevices }})
          </TabsTrigger>
          <TabsTrigger value="return">
            Đã trả ({{ totalReturnedDevices }})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="ready-borrow">
          <ReceiptAdminReadyBorrowTable />
        </TabsContent>
        <TabsContent value="borrow">
          <ReceiptAdminBorrowTable />
        </TabsContent>
        <TabsContent value="return">
          <ReceiptAdminReturnTable />
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>
