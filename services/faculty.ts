export interface Faculty {
  name: string;
  id: string;
};

export const facultyService = {
  // TODO: Replace with real implementation
  async getAllFaculties (): Promise<Faculty[]> {
    return [
      { name: 'Khoa Khoa Học và Kĩ thuật Máy tính', id: '0' },
      { name: 'Trung tâm Bảo dưỡng Công nghiệp', id: '1' },
      { name: 'Khoa Cơ khí', id: '2' },
      { name: 'Khoa Kỹ thuật Địa chất và Dầu khí', id: '3' },
      { name: 'Khoa Điện - Điện tử', id: '4' },
      { name: 'Khoa Kỹ thuật Giao thông', id: '5' },
      { name: 'Khoa Kỹ thuật Hoá học', id: '6' },
      { name: 'Khoa Môi trường và Tài nguyên', id: '7' },
      { name: 'Khoa Quản lý Công nghiệp', id: '8' },
      { name: 'Khoa Khoa học Ứng dụng', id: '9' },
      { name: 'Khoa Công nghệ Vật liệu', id: '10' },
      { name: 'Khoa Kỹ thuật Xây dựng', id: '11' },
    ];
  },
};
