export interface Faculty {
  name: string;
  id: string;
};

export const facultyService = {
  // TODO: Replace with real implementation
  async getAllFaculties (): Promise<Faculty[]> {
    return [
      { name: 'Khoa Học và Kĩ thuật Máy tính', id: '0' },
      { name: 'Điện tử - Viễn thông', id: '1' },
    ];
  },
};
