import { Icon } from '#components';
import type { DeviceKindInCartList } from './schema';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

export function createColumns ({
  onDeviceKindLinkClick,
}: {
  onDeviceKindLinkClick: (id: string) => void,
}): AugmentedColumnDef<DeviceKindInCartList>[] {
  return [
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
    {
      id: 'link',
      title: '',
      cell: ({ row }) =>
        h(
          'div',
          { class: 'flex justify-end items-center text-lg hover:cursor-pointer', onClick: () => onDeviceKindLinkClick(row.original.id) },
          h(Icon, { name: 'i-heroicons-arrow-top-right-on-square' }),
        ),
    },
  ];
}
