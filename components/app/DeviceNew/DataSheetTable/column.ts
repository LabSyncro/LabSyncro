import { Icon } from '#components';
import type { DeviceSchema } from './schema';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

export function createColumns ({
  onDeviceKindLinkClick,
}: {
  onDeviceKindLinkClick: (id: string) => void;
}): AugmentedColumnDef<DeviceSchema>[] {
  return [
    {
      id: 'fullId',
      title: 'Mã định danh',
      cell: ({ row }) =>
        h('p', { class: 'text-normal pl-3' }, [
          `${row.original.kind}/${row.original.id}`.toUpperCase(),
        ]),
      enableSorting: true,
    },
    {
      id: 'status',
      title: 'Tình trạng',
      cell: ({ row }) =>
        h(
          'span',
          {
            class:
              'bg-gray-100 text-black rounded-sm p-1 px-2 border border-gray-200 text-normal',
          },
          (statusMap as any)[row.original.status],
        ),
    },
    {
      id: 'room',
      title: 'Phòng thí nghiệm',
      cell: ({ row }) =>
        h(
          'p',
          {
            class:
              'line-clamp-2 text-slate-500 text-normal leading-6 font-normal',
          },
          `${row.original.room}, ${row.original.branch}`,
        ),
      enableSorting: true,
    },
    {
      id: 'price',
      title: 'Đơn giá (VND)',
      cell: ({ row }) =>
        h(
          'p',
          {
            class:
              'text-slate-500 text-right text-normal leading-6 font-normal',
          },
          row.original.price,
        ),
      enableSorting: true,
    },
    {
      id: 'createdAt',
      title: 'Ngày nhập',
      cell: ({ row }) => {
        return h(
          'span',
          {
            class: 'text-slate-500 text-sm font-normal leading-tight',
          },
          row.original.createdAt,
        );
      },
      enableSorting: true,
    },
    {
      id: 'link',
      title: '',
      cell: ({ row }) =>
        h(
          'div',
          {
            class: 'flex justify-end items-center text-lg hover:cursor-pointer',
            onClick: () => onDeviceKindLinkClick(row.original.id),
          },
          h(Icon, { name: 'i-heroicons-arrow-top-right-on-square' }),
        ),
    },
  ];
}
