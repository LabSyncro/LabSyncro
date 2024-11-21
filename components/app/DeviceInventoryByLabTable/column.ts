import { HighlightText, Icon } from '#components';
import type { ColumnDef } from '@tanstack/vue-table';
import ColumnHeader from './ColumnHeader.vue';
import type { DeviceByLab } from './schema';

export function createColumns ({ searchText }: { searchText: string }): ColumnDef<DeviceByLab>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => h(ColumnHeader, { column, title: 'Phòng thí nghiệm' }),
      cell: ({ row }) =>
        h(
          'div',
          {
            class: 'justify-center items-start gap-3 inline-flex',
          },
          [
            h(
              HighlightText,
              { text: row.getValue('name') as string, matchText: searchText, class: 'text-slate-500 text-sm font-normal leading-none' },
            ),
          ],
        ),
    },
    {
      accessorKey: 'borrowableQuantity',
      header: ({ column }) =>
        h(ColumnHeader, {
          column,
          title: 'Sẵn sàng mượn',
          class: 'w-16',
        }),
      cell: ({ row }) =>
        row.getValue('borrowableQuantity') as number > 0 ?
          h('p', { class: 'relative text-green-500 pl-6 sm:pl-8' }, [h('span', { class: 'absolute left-0.5 top-1 bg-green-500 rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center' }), [h(Icon, { name: 'i-heroicons-check', class: 'text-white text-sm font-bold' })], h('span', `${row.getValue('borrowableQuantity')} cái`)])
          : h('p', { class: 'text-gray-dark flex items-center gap-2 text-center' }, [h(Icon, { name: 'i-heroicons-archive-box-x-mark', class: 'text-md font-bold' }), h('span', 'Không có sẵn')]),
    },
  ];
};
