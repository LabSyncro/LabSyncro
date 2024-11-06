import { sortBy } from 'lodash-es';

export interface Faculty {
  name: string;
  id: number;
};

export const facultyService = {
  async getAllFaculties(): Promise<Faculty[]> {
    return sortBy((await $fetch('/api/faculty')).faculties, ({ name }) => name);
  },
};
