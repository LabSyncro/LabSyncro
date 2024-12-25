<script setup lang="ts">
import { categoryService } from '~/services';

const router = useRouter();

const deviceName = ref('');
const deviceKindId = ref('');
const status = ref('');
const category = ref('');
const categories = ref<{ id: string; value: string; label: string }[]>([]);
const brand = ref('');
const description = ref('');
const imagePreview = ref<string[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const handleDeviceSelect = (device: any) => {
  deviceName.value = device.name;
  deviceKindId.value = device.id.toUpperCase();
  status.value = device.status;
  category.value = device.category;
  brand.value = device.brand;
  description.value = device.description;
  const mainImage = device.mainImage ? [device.mainImage] : [];
  const subImages = device.subImages || [];
  imagePreview.value = [...mainImage, ...subImages];
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    Array.from(target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          imagePreview.value.push(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  }
};
const handleDeviceKindLinkClick = () => {
  router.push({ path: `/devices/${deviceKindId.value}` });
};

onMounted(async () => {
  const data = await categoryService.getCategories();
  categories.value = data.map(({ id, name }) => ({ id, value: name, label: name }));
});
</script>`

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
          <NuxtLink class="text-normal font-bold underline text-black" href="/admin/devices">Danh sách loại thiết bị
          </NuxtLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <main class="my-10">
      <section class="bg-white mt-8 p-4 py-8 pb-8">
        <div>
          <h1 class="text-2xl font-semibold mb-6">Tổng quan thiết bị</h1>
          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm text-gray-600">Tên thiết bị *</label>
              <DeviceNewSearchBox @device-select="handleDeviceSelect" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <label class="text-sm text-gray-600">Mã thiết bị</label>
                <Input v-model="deviceKindId" placeholder="ABC-DEF" />
              </div>
              <div class="space-y-2">
                <label class="text-sm text-gray-600">Trạng thái *</label>
                <Select v-model="status">
                  <SelectTrigger>
                    <SelectValue placeholder="Nháp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm text-gray-600">Thương hiệu</label>
                <Input v-model="brand" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-gray-600">Mô tả thiết bị</label>
              <Textarea v-model="description" placeholder="Nhập mô tả thiết bị..." class="h-40" />
            </div>

            <div class="space-y-2">
              <label class="text-sm text-gray-600">Hình ảnh minh họa</label>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div class="flex flex-col items-center">
                  <div class="flex flex-wrap gap-4">
                    <div
v-for="(image, index) in imagePreview" :key="index"
                      class="w-32 h-32 flex justify-center items-center border rounded-lg overflow-hidden">
                      <img :src="image" alt="Preview" class="w-full h-full object-cover" >
                    </div>
                  </div>
                  <Button class="bg-tertiary-dark hover:bg-tertiary-darker mt-4" @click="triggerFileInput">
                    Tải lên từ máy
                  </Button>
                  <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileUpload">
                  <p class="text-sm text-gray-500 mt-2">
                    Số hình tối đa: 4 hình (tối đa 100MB/hình). Loại file hỗ trợ: .png, .jpeg.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-white mt-8 p-4 py-8 pb-8">
        <h1 class="font-bold text-2xl mb-8"> Tồn kho thiết bị </h1>
        <DeviceNewInventoryTable
:key="deviceKindId" :kind-id="deviceKindId" :kind-name="deviceName"
          @device-kind-link-click="handleDeviceKindLinkClick" />
      </section>

      <section class="bg-white mt-8 p-4 py-8 pb-8">
        <h1 class="font-bold text-2xl mb-8"> Quyền hạn </h1>
        <DeviceNewPermission />
      </section>

      <section class="bg-white mt-8 p-4 py-8 pb-8">
        <h1 class="font-bold text-2xl mb-8"> Chi tiết kỹ thuật </h1>
        <Tabs default-value="borrow">
          <TabsList class="flex items-start justify-start gap-4 bg-white mb-8">
            <TabsTrigger value="borrow">
              Thông số
            </TabsTrigger>
            <TabsTrigger value="return">
              Tài liệu kỹ thuật
            </TabsTrigger>
          </TabsList>
          <TabsContent value="borrow" />
        </Tabs>
      </section>
    </main>
  </div>
</template>
