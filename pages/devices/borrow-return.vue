<script setup lang="ts">
import { columns } from '@/components/BorrowReturnDeviceTable/column';
import type { BorrowReturnDevice } from '@/components/BorrowReturnDeviceTable/schema';

const generateMockData = (num: number): BorrowReturnDevice[] => {
  const mockData: BorrowReturnDevice[] = [];

  for (let i = 0; i < num; i++) {
    mockData.push({
      id: i + 1,
      image: '', // Replace with actual image URLs
      name: `Device ${i + 1}`,
      quantity: Math.floor(Math.random() * 100), // Random quantity between 0 and 99
      lab: `Lab ${Math.floor(Math.random() * 5) + 1}`, // Random lab name
      facility: `Facility ${Math.floor(Math.random() * 3) + 1}`, // Random facility name
      borrowDate: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date in the last 10 days
      returnDate: new Date(Date.now() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Random date in the next 10 days
      status: Math.random() > 0.5 ? 'On Time' : 'Late', // Random status
    });
  }

  return mockData;
};

// Generate 20 mock devices
const mockDevices: BorrowReturnDevice[] = generateMockData(20);
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
    <main class="my-10 min-h-screen max-w-7xl flex-1 bg-white p-4">
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
          <BorrowReturnDeviceTableToolbar />
          <BorrowReturnDeviceTable :data="mockDevices" :columns="columns" />
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>
