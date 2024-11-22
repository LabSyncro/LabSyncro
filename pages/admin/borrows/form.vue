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
          <NuxtLink class="text-normal font-bold underline text-black" href="/admin/borrows/form">Mượn thiết bị
          </NuxtLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <main class="my-10">
      <div class="flex flex-col lg:flex-row gap-8">
        <div>
          <div class="bg-white p-4">
            <h2 class="text-lg mb-6">Danh sách mượn</h2>
            <DeviceTableSection :read-only="true" :columns="['select', 'name', 'category', 'borrowableQuantity']" />
          </div>
        </div>
        <div class="flex flex-col gap-8 min-w-[350px]">
          <div class="bg-white p-4">
            <div class="flex gap-2 justify-between items-center mb-8">
              <h2 class="text-lg">Người mượn</h2>
              <button
                class="bg-slate-200 border border-slate-400 text-slate-dark rounded-md flex items-center gap-2 p-2">
                <Icon aria-hidden class="left-3 top-[13px] text-xl" name="i-heroicons-qr-code" />
                <p class="hidden 2xl:block">Quét mã người mượn</p>
              </button>
            </div>
            <form>
              <div class="mb-4">
                <label class="text-normal text-slate-dark mb-2 block">Họ và tên *</label>
                <input type="text" required class="border-slate-300 rounded-md border w-[100%] p-1">
              </div>
              <div class="mb-4">
                <label class="text-normal text-slate-dark mb-2 block">Mã số sinh viên *</label>
                <input type="text" required class="border-slate-300 rounded-md border w-[100%] p-1">
              </div>
              <div class="mb-4">
                <label class="text-normal text-slate-dark mb-2 block">Vai trò *</label>
                <input type="text" required class="border-slate-300 rounded-md border w-[100%] p-1">
              </div>
            </form>
          </div>
          <div class="bg-white p-4">
            <h2 class="text-lg mb-6">Thông tin mượn</h2>
            <form>
              <div class="mb-4">
                <label class="text-normal text-slate-dark mb-2 block">Mã đơn mượn</label>
                <input type="text" required class="border-slate-300 rounded-md border w-[100%] p-1">
              </div>
              <div class="mb-4">
                <label class="text-normal text-slate-dark mb-2 block">Ngày mượn *</label>
                <input type="text" required class="border-slate-300 rounded-md border w-[100%] p-1">
              </div>
              <div class="mb-4">
                <label class="text-normal text-slate-dark mb-2 block">Địa điểm mượn *</label>
                <input type="text" required class="border-slate-300 rounded-md border w-[100%] p-1">
              </div>
              <div class="mb-4">
                <label class="text-normal text-slate-dark mb-2 block">Ngày hẹn trả *</label>
                <input type="text" required class="border-slate-300 rounded-md border w-[100%] p-1">
              </div>
              <div class="mb-4">
                <label class="text-normal text-slate-dark mb-2 block">Địa điểm hẹn trả *</label>
                <input type="text" required class="border-slate-300 rounded-md border w-[100%] p-1">
              </div>
            </form>
          </div>
          <div class="flex justify-end">
            <button class="bg-tertiary-darker text-normal text-white rounded-md p-2 px-4">
              Xác nhận mượn
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
