import { NuxtLink } from '#components';
import type { AdminDeviceList } from './schema';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

export const columns: AugmentedColumnDef<AdminDeviceList>[] = [
  {
    id: 'name',
    title: 'Tên loại thiết bị',
    cell: ({ row }) =>
      h(
        NuxtLink,
        {
          class: 'justify-start items-center gap-3 flex',
          href: `/devices/${row.original.id}`,
        },
        [
          h(
            'p',
            { class: 'p-1 px-2 text-nowrap bg-gray-100 border border-gray-300 rounded-md text-normal font-normal leading-none' },
            `${row.original.id.slice(0, 4)} ${row.original.id.slice(4)}`.toUpperCase(),
          ),
          h(
            'p',
            { class: 'line-clamp-2 text-slate-500 text-normal leading-6 font-normal' },
            row.getValue('name'),
          ),
        ],
      ),
  },
  {
    id: 'borrowableQuantity',
    title: 'Sẵn có',
    cell: ({ row }) => h(
      'p',
      { class: 'text-slate-500 text-sm font-normal leading-tight text-right' },
      row.getValue('borrowableQuantity'),
    ),
  },
  {
    id: 'quantity',
    title: 'Tổng',
    cell: ({ row }) => {
      return h(
        'p',
        { class: 'text-slate-500 text-sm font-normal leading-tight text-right' },
        row.getValue('quantity'),
      );
    },
  },
];
