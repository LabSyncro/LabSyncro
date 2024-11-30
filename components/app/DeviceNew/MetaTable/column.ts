import type { MetaSchema } from './schema';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

export const columns: AugmentedColumnDef<MetaSchema>[] = [
  {
    id: 'attribute',
    title: 'Thuộc tính',
    cell: ({ row }) =>
      h(
        'p',
        {
          class:
            'line-clamp-2 text-slate-500 text-right text-normal leading-6 font-normal',
        },
        row.original.attribute,
      ),
    enableSorting: true,
  },
  {
    id: 'value',
    title: 'Giá trị',
    cell: ({ row }) => {
      return h(
        'span',
        {
          class: 'text-slate-500 text-sm font-normal leading-tight',
        },
        row.original.value,
      );
    },
    enableSorting: true,
  },
];
