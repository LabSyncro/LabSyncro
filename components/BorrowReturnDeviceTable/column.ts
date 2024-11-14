import type { ColumnDef } from '@tanstack/vue-table';
import { Checkbox } from '@/components/ui/checkbox';
import ColumnHeader from './ColumnHeader.vue';
import RowAction from './RowAction.vue';

import type { BorrowReturnDevice } from './schema';
import { formatDate } from '~/lib/utils';

export const columns: ColumnDef<BorrowReturnDevice>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:checked': (value) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
        class: 'translate-y-0.5',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
        class: 'translate-y-0.5',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Tên thiết bị' }),
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
            row.getValue('name'),
          ),
        ],
      ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Số lượng' }),
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.getValue('quantity'),
      ),
  },
  {
    accessorKey: 'lab',
    header: ({ column }) =>
      h(ColumnHeader, {
        column,
        title: 'Nơi mượn',
      }),
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.getValue('lab'),
      ),
  },
  {
    accessorKey: 'facility',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Nơi trả' }),
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.getValue('facility'),
      ),
  },
  {
    accessorKey: 'borrowDate',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Ngày mượn' }),
    cell: ({ row }) => {
      const value = row.getValue('borrowDate') as string;
      return h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        formatDate(value),
      );
    },
  },
  {
    accessorKey: 'returnDate',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Ngày hẹn trả' }),
    cell: ({ row }) => {
      const value = row.getValue('returnDate') as string;
      return h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        formatDate(value),
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Tiến độ' }),
    cell: ({ row }) =>
      h(
        'span',
        {
          class: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            row.getValue('status') === 'Đúng hẹn'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`,
        },
        row.getValue('status'),
      ),
  },
  {
    id: 'actions',
    cell: ({ row }) => h(RowAction, { row }),
  },
];
