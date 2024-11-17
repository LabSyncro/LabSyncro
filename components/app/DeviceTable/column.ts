import { NuxtLink } from '#components';
import type { ColumnDef } from '@tanstack/vue-table';
import { Checkbox } from '@/components/ui/checkbox';
import ColumnHeader from './ColumnHeader.vue';
import RowAction from './RowAction.vue';

import type { AdminDeviceList } from './schema';

export function createColumns({ sortField, sortOrder }: { sortField: Ref<string | undefined>; sortOrder: Ref<'desc' | 'asc' | undefined> }): ColumnDef<AdminDeviceList>[] {
  return [
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
      header: ({ column }) => h(ColumnHeader, { id: 'name', sortField, sortOrder, class: 'w-[250px] sm:w-[300px]', column, title: 'Tên loại thiết bị' }),
      cell: ({ row }) =>
        h(
          NuxtLink,
          {
            class: 'justify-center items-center gap-3 inline-flex',
            href: `/devices/${row.original.id}`,
          },
          [
            h('img', {
              src: row.original.mainImage,
              alt: row.original.name,
              class: 'w-8 h-8 relative object-cover rounded-lg',
            }),
            h(
              'p',
              { class: 'line-clamp-2 text-slate-500 text-normal leading-6 font-normal leading-none' },
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
          id: 'category', sortField, sortOrder,
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
      header: ({ column }) => h(ColumnHeader, { id: 'brand', sortField, sortOrder, column, title: 'Thương hiệu' }),
      cell: ({ row }) =>
        h(
          'span',
          { class: 'text-slate-500 text-sm font-normal leading-tight' },
          row.getValue('brand'),
        ),
    },
    {
      accessorKey: 'borrowableQuantity',
      header: ({ column }) => h(ColumnHeader, { id: 'borrowable_quantity', sortField, sortOrder, column, title: 'Có thể mượn' }),
      cell: ({ row }) => h(
        'p',
        { class: 'text-slate-500 text-sm font-normal leading-tight text-right' },
        row.getValue('borrowableQuantity'),
      ),
    },
    {
      accessorKey: 'quantity',
      header: ({ column }) => h(ColumnHeader, { id: 'quantity', sortField, sortOrder, column, title: 'Tổng' }),
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
}
