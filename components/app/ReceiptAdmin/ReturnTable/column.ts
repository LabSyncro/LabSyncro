import type { ReturnedReceiptDevice } from './schema';
import { formatDate } from '~/lib/utils';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

const statusMap = {
  late: 'Trễ hạn',
  on_time: 'Đúng hạn',
};

export const columns: AugmentedColumnDef<ReturnedReceiptDevice>[] = [
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
    id: 'borrowedPlace',
    title: 'Nơi mượn',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.original.borrowedPlace,
      ),
    enableSorting: true,
  },
  {
    id: 'returnedPlace',
    title: 'Nơi trả',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.original.returnedPlace,
      ),
    enableSorting: true,
  },
  {
    id: 'borrowedAt',
    title: 'Ngày mượn',
    cell: ({ row }) => {
      const value = row.original.borrowedAt.toString();
      return h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        formatDate(value),
      );
    },
    enableSorting: true,
  },
  {
    id: 'expectedReturnedAt',
    title: 'Ngày hẹn trả',
    cell: ({ row }) => {
      const value = row.original.expectedReturnedAt.toString();
      return h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        formatDate(value),
      );
    },
    enableSorting: true,
  },
  {
    id: 'returnedAt',
    title: 'Ngày thực trả',
    cell: ({ row }) => {
      const value = row.original.returnedAt?.toString();
      return h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        value ? formatDate(value) : 'Chưa trả',
      );
    },
  },
  {
    id: 'status',
    title: 'Tiến độ',
    cell: ({ row }) =>
      h(
        'span',
        {
          class: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusMap[row.original.status] === 'Đúng hạn'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`,
        },
        statusMap[row.original.status],
      ),
    enableSorting: true,
  },
];
