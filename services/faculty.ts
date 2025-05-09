import { sortBy } from 'lodash-es';

export interface Faculty {
  name: string;
  id: number;
};

export const facultyService = {
  async getAllFaculties (): Promise<Faculty[]> {
    const { $cachedFetch } = useNuxtApp();
    return sortBy((await $cachedFetch('/api/faculties')).faculties, ({ name }: { name: string }) => name);
  },
};
