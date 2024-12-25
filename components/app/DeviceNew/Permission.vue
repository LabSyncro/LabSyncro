<script setup lang="ts">
interface PermissionsForm {
  currentRole: string
  borrowPermission: string
}

const form = reactive<PermissionsForm>({
  currentRole: '',
  borrowPermission: ''
});

const emit = defineEmits<{
  'update': [form: PermissionsForm]
}>();

watch(form, (newValue) => {
  emit('update', { ...newValue });
}, { deep: true });
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-2">
      <label class="text-sm text-gray-600">
        Hiện thị <span class="text-red-500">*</span>
      </label>
      <Select v-model="form.currentRole">
        <SelectTrigger>
          <SelectValue placeholder="Sinh viên, Giảng viên" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="teacher">Giảng viên</SelectItem>
          <SelectItem value="both">Sinh viên, Giảng viên</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <label class="text-sm text-gray-600">
      Cho phép mượn trả <span class="text-red-500">*</span>
    </label>
    <Select v-model="form.borrowPermission">
      <SelectTrigger>
        <SelectValue placeholder="Giảng viên" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="teacher">Giảng viên</SelectItem>
        <SelectItem value="both">Sinh viên, Giảng viên</SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
