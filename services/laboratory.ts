import { sortBy } from 'lodash-es';

export const laboratoryService = {
  async getAllLabsByFaculty (faculty: string): Promise<Record<string, unknown>[]> {
    return sortBy((await $fetch('/api/laboratory', { query: { faculty } })).branches, ({ name }) => name);
  }
};
