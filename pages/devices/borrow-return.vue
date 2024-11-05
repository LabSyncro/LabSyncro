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
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-7xl">
      <h1 class="mb-8 text-2xl font-bold">Danh sách thiết bị</h1>
      <BorrowReturnDeviceTable :data="mockDevices" :columns="columns" />
    </div>
  </div>
</template>
