import type { ReadyBorrowedDevice } from './schema';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

export const columns: AugmentedColumnDef<ReadyBorrowedDevice>[] = [
  {
    id: 'name',
    title: 'Tên thiết bị',
    cell: ({ row }) =>
      h(
        'div',
        {
          class: 'justify-center items-start gap-3 inline-flex',
        },
        [
          h('img', {
            src: row.original.image,
            alt: row.original.name,
            class: 'w-8 h-8 relative object-cover rounded-lg',
          }),
          h(
            'span',
            { class: 'text-slate-500 text-xs font-normal leading-none' },
            row.original.name,
          ),
        ],
      ),
    enableSorting: true,
  },
  {
    id: 'quantity',
    title: 'Số lượng',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.original.quantity,
      ),
    enableSorting: true,
  },
  {
    id: 'place',
    title: 'Địa điểm chứa',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.original.place,
      ),
    enableSorting: true,
  },
];
