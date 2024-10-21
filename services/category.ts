export interface Category {
  name: string;
  sub?: Category[];
};

export const categoryService = {
  // TODO: Replace with real implementation
  async getCategoriesForProductModal (): Promise<Category[]> {
    return [
      {
        name: 'IC - Mạch Tích Hợp',
        sub: [
          { name: 'IC Vi Điều Khiển MCU, Vi Xử Lý MPU' },
          { name: 'IC Nhớ' },
          { name: 'IC Giao Tiếp' },
          { name: 'IC Logic, IC Số' },
          { name: 'IC Chuyển Đổi Dữ Liệu' },
          { name: 'IC RF, RFID' },
          { name: 'IC Driver' },
          { name: 'IC Logic Lập Trình - FPGA'},
          { name: 'IC Nguồn' },
          { name: 'IC Khuếch Đại & So Sánh'},
        ],
      },
      {
        name: 'Mạch Điện, Module, Thiết Bị Nạp',
        sub: [
          { name: 'Mạch Chức Năng, Mạch Phát Triển, Module Shield' },
        ],
      },
    ];
  },
};
