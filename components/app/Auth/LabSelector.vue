<script setup lang="ts">
import { laboratoryService } from "~/services";

const emit = defineEmits<{
  (
    e: "select",
    lab: { id: string; name: string; room: string; branch: string }
  ): void;
}>();

const isLoading = ref(true);
const labs = ref<
  Array<{ id: string; name: string; room: string; branch: string }>
>([]);
const selectedLabId = ref("");
const error = ref("");

onMounted(async () => {
  try {
    const response = await laboratoryService.getLabsManagedByAdmin(0, 500, {});
    labs.value = response.labs;
  } catch (err: any) {
    error.value = err.data?.message || "Failed to load laboratories";
  } finally {
    isLoading.value = false;
  }
});

function handleSelect() {
  const selectedLab = labs.value.find((lab) => lab.id === selectedLabId.value);
  if (selectedLab) {
    emit("select", selectedLab);
  }
}
</script>

<template>
  <div class="space-y-4">
    <div v-if="isLoading" class="text-center py-4">
      <div
        class="inline-block w-6 h-6 border-2 border-tertiary-darker border-t-transparent rounded-full animate-spin"
      ></div>
      <p class="mt-2 text-sm text-gray-500">Loading laboratories...</p>
    </div>

    <div v-else-if="error" class="text-center text-red-600">
      {{ error }}
    </div>

    <div v-else-if="labs.length === 0" class="text-center text-gray-500">
      No laboratories available.
    </div>

    <div v-else class="space-y-4">
      <div class="space-y-2">
        <Select v-model="selectedLabId">
          <SelectTrigger id="lab-select" :disabled="isLoading">
            <SelectValue placeholder="Select a laboratory" />
          </SelectTrigger>
          <SelectContent>
            <div v-if="isLoading" class="flex items-center justify-center p-2">
              <div
                class="w-4 h-4 border-2 border-gray-300 border-t-primary rounded-full animate-spin"
              ></div>
            </div>
            <SelectItem v-for="lab in labs" :key="lab.id" :value="lab.id">
              {{ lab.room }}, {{ lab.branch }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        :disabled="!selectedLabId"
        @click="handleSelect"
        class="w-full bg-tertiary-dark hover:bg-tertiary-darker"
      >
        Confirm Selection
      </Button>
    </div>
  </div>
</template>
