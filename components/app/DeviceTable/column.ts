import { Icon, NuxtLink } from '#components';
import type { ColumnDef } from '@tanstack/vue-table';
import { Checkbox } from '@/components/ui/checkbox';
import ColumnHeader from './ColumnHeader.vue';
import type { AdminDeviceList } from './schema';

export function createColumns ({ sortField, sortOrder, rowSelection, onSelectRows, onSelectAllRows, onDeleteRow, onDeleteSelectedRows }: { sortField: string | undefined; sortOrder: 'desc' | 'asc' | undefined; rowSelection: string[]; onSelectRows: (_: string[]) => void; onSelectAllRows: (_: string[]) => void ; onDeleteRow: (_: string) => void; onDeleteSelectedRows: (_: string[]) => void }): ColumnDef<AdminDeviceList>[] {
  return [
    {
      accessorKey: 'select',
      id: 'select',
      header: ({ table }) =>
        h('div', { class: 'flex items-center' },
          [h(Checkbox, {
            checked: table.getCoreRowModel().rows.every((row) => rowSelection.includes(row.original.id)),
            'onUpdate:checked': () => onSelectAllRows(table.getCoreRowModel().rows.map((row) => row.original.id)),
            ariaLabel: 'Select all',
            class: 'translate-y-0.5',
          })],
        ),
      cell: ({ row }) =>
        h('div', { class: 'flex items-center' },
          [h(Checkbox, {
            checked: rowSelection.includes(row.original.id),
            'onUpdate:checked': () => onSelectRows([row.original.id]),
            ariaLabel: 'Select row',
            class: 'translate-y-0.5',
          })],
        ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => h(ColumnHeader, { id: 'name', sortField, sortOrder, class: 'w-[300px] sm:w-[400px]', column, title: 'Tên loại thiết bị' }),
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
      accessorKey: 'borrowableQuantity',
      header: ({ column }) => h(ColumnHeader, { id: 'borrowable_quantity', sortField, sortOrder, column, title: 'Còn' }),
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
      accessorKey: 'delete',
      id: 'delete',
      header: ({ table }) =>
        h('div', { class: 'flex items-center hover:cursor-pointer', onClick: () => onDeleteSelectedRows(table.getCoreRowModel().rows.map((row) => row.original.id)) },
          [
            h(Icon, { name: 'i-heroicons-trash', class: `${rowSelection.length === 0 ? 'hidden' : 'block' } ml-4 text-danger-darker text-lg font-bold` }),
          ],
        ),
      cell: ({ row }) =>
        h('div', { class: 'flex items-center hover:cursor-pointer', onClick: () => onDeleteRow(row.original.id) },
          [
            h(Icon, { name: 'i-heroicons-trash', class: 'ml-4 text-danger-darker text-lg font-bold' }),
          ],
        ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
}
