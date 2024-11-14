import type { ColumnDef } from '@tanstack/vue-table';
import { Checkbox } from '@/components/ui/checkbox';
import ColumnHeader from './ColumnHeader.vue';
import RowAction from './RowAction.vue';

import type { AdminDeviceList } from './schema';

export const columns: ColumnDef<AdminDeviceList>[] = [
  {
    id: 'select',
    header: ({ table }) =>
      h(Checkbox, {
        checked:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate'),
        'onUpdate:checked': (value: unknown) => table.toggleAllPageRowsSelected(!!value),
        ariaLabel: 'Select all',
        class: 'translate-y-0.5',
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        checked: row.getIsSelected(),
        'onUpdate:checked': (value: unknown) => row.toggleSelected(!!value),
        ariaLabel: 'Select row',
        class: 'translate-y-0.5',
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Tên loại thiết bị' }),
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
    accessorKey: 'category',
    header: ({ column }) =>
      h(ColumnHeader, {
        column,
        title: 'Phân nhóm',
      }),
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.getValue('category'),
      ),
  },
  {
    accessorKey: 'brand',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Thương hiệu' }),
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.getValue('brand'),
      ),
  },
  {
    accessorKey: 'usableQuantity',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Khả dụng' }),
    cell: ({ row }) => h(
      'span',
      { class: 'text-slate-500 text-sm font-normal leading-tight' },
      row.getValue('usableQuantity'),
    ),
  },
  {
    accessorKey: 'totalQuantity',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Tổng' }),
    cell: ({ row }) => {
      return h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.getValue('totalQuantity'),
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(RowAction, { row }),
  },
];
