import type { ReturnDevice } from './schema';
import { formatDate } from '~/lib/utils';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';

const statusMap = {
  late: 'Trễ hạn',
  on_time: 'Đúng hạn',
};

const deviceStatusMap = {
  healthy: 'Tốt',
  broken: 'Hư hỏng',
  assessing: 'Đang kiểm tra',
  lost: 'Mất',
};

const deviceStatusColorMap = {
  healthy: 'bg-green-100 text-green-800',
  broken: 'bg-red-100 text-red-800',
  assessing: 'bg-yellow-100 text-yellow-800',
  lost: 'bg-gray-100 text-gray-800',
};

export const columns: AugmentedColumnDef<ReturnDevice>[] = [
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
      const value = row.original.returnedAt.toString();
      return h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        formatDate(value),
      );
    },
    enableSorting: true,
  },
  {
    id: 'status',
    title: 'Tiến độ trả',
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
  {
    id: 'deviceStatus',
    title: 'Trạng thái thiết bị',
    cell: ({ row }) =>
      h(
        'span',
        {
          class: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            deviceStatusColorMap[row.original.deviceStatus]
          }`,
        },
        deviceStatusMap[row.original.deviceStatus],
      ),
    enableSorting: true,
  },
  {
    id: 'note',
    title: 'Ghi chú',
    cell: ({ row }) =>
      h(
        'span',
        { class: 'text-slate-500 text-sm font-normal leading-tight' },
        row.original.note,
      ),
  },
];
