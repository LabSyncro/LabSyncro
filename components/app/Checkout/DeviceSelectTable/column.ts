import { Icon, NuxtLink } from '#components';
import type { DeviceSchema } from './schema';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

const statusMap = {
  healthy: 'Tốt',
  broken: 'Hư',
  discarded: 'Đã thanh lý',
  assessing: 'Đang kiểm kê',
  shipping: 'Đang vận chuyển',
  maintaining: 'Bảo trì',
  borrowing: 'Đang mượn',
  lost: 'Mất',
};

export function createColumns (
  borrowedDevices: string[],
  actions: {
    deleteDevice: (id: string) => void;
    borrowDevice: (id: string) => void;
  },
): AugmentedColumnDef<DeviceSchema>[] {
  return [
    {
      id: 'id',
      title: 'Mã thiết bị',
      cell: ({ row }) =>
        h(
          'p',
          { class: 'text-normal pl-3' },
          [`${row.original.kind}/${row.original.id}`.toUpperCase()],
        ),
      enableSorting: true,
    },
    {
      id: 'status',
      title: 'Tình trạng',
      cell: ({ row }) =>
        h(
          'span',
          { class: 'bg-gray-100 text-black rounded-sm p-1 px-2 border border-gray-200 text-normal' },
          (statusMap as any)[row.original.status],
        ),
    },
    {
      id: 'room',
      title: 'Phòng thí nghiệm',
      cell: ({ row }) =>
        h(
          'p',
          { class: 'line-clamp-2 text-slate-500 text-normal leading-6 font-normal' },
          `${row.original.room}, ${row.original.branch}`,
        ),
      enableSorting: true,
    },
    {
      id: 'action',
      title: '',
      cell: ({ row }) =>
        h('div', { class: 'flex items-center hover:cursor-pointer' },
          borrowedDevices.includes(row.original.id) ? [
            h(Icon, { name: 'i-heroicons-trash', class: 'block m-2 text-danger-darker text-lg font-bold', onClick: () => actions.deleteDevice(row.original.id) }),
          ] : [
            h('button', { class: 'p-2 rounded-md bg-secondary-dark text-tertiary-darker', onClick: () => actions.borrowDevice(row.original.id) }, 'Mượn'),
          ],
        ),
      enableSorting: false,
    },
  ];
}
