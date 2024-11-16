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
    header: ({ column }) => h(ColumnHeader, { class: 'w-[250px] sm:w-[300px]', column, title: 'Tên loại thiết bị' }),
    cell: ({ row }) =>
      h(
        'div',
        {
          class: 'justify-center items-center gap-3 inline-flex',
        },
        [
          h('img', {
            src: row.original.mainImage,
            alt: row.original.name,
            class: 'w-8 h-8 relative object-cover rounded-lg',
          }),
          h(
            'p',
            { class: 'line-clamp-2 text-slate-500 text-normal leading-5 font-normal leading-none' },
            row.getValue('name'),
          ),
        ],
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
    accessorKey: 'borrowableQuantity',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Có thể mượn' }),
    cell: ({ row }) => h(
      'p',
      { class: 'text-slate-500 text-sm font-normal leading-tight text-right' },
      row.getValue('borrowableQuantity'),
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => h(ColumnHeader, { column, title: 'Tổng' }),
    cell: ({ row }) => {
      return h(
        'p',
        { class: 'text-slate-500 text-sm font-normal leading-tight text-right' },
        row.getValue('quantity'),
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => h(RowAction, { row }),
  },
];
