import { sortBy } from 'lodash-es';

export interface Faculty {
  name: string;
  id: number;
};

export interface Branch {
  name: string;
  id: number;
}

export const facultyService = {
  async getAllFaculties(): Promise<Faculty[]> {
    return sortBy((await $fetch('/api/faculty')).faculties, ({ name }) => name);
  },
  async getAllBranchesByFaculty(faculty: string): Promise<Branch[]> {
    return sortBy((await $fetch('/api/faculty/branches', { query: { faculty } })).branches, ({ name }) => name);
  }
};
