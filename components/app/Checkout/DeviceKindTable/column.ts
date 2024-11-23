import { NuxtLink } from '#components';
import type { DeviceInCartList } from './schema';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

export const columns: AugmentedColumnDef<DeviceInCartList>[] = [
  {
    id: 'id',
    title: 'Mã loại thiết bị',
    cell: ({ row }) =>
      h(
        'p',
        { class: 'text-normal pl-3' },
        [row.original.id.toUpperCase()],
      ),
  },
  {
    id: 'name',
    title: 'Tên loại thiết bị',
    cell: ({ row }) =>
      h(
        'p',
        { class: 'line-clamp-2 text-slate-500 text-normal leading-6 font-normal' },
        row.original.name,
      ),
  },
  {
    id: 'quantity',
    title: 'SL',
    cell: ({ row }) =>
      h(
        'p',
        { class: 'line-clamp-2 text-slate-500 text-right text-normal leading-6 font-normal' },
        row.original.quantity,
      ),
  },
];
