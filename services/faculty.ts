export interface Faculty {
  name: string;
  id: string;
};

export const facultyService = {
  // TODO: Replace with real implementation
  async getAllFaculties (): Promise<Faculty[]> {
    return [
      { name: 'Khoa Khoa Học và Kĩ thuật Máy tính', id: '0' },
      { name: 'Khoa Điện tử - Viễn thông', id: '1' },
    ];
  },
};
