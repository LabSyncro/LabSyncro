import type { LabManagedByAdmin } from './schema';
import type { AugmentedColumnDef } from '~/components/common/DataTable/column';
import { Icon, Button } from '#components';

const formatTimetable = (timetable: Record<string, string[]>) => {
  const days: Record<string, string> = {
    '2': 'Thứ 2',
    '3': 'Thứ 3',
    '4': 'Thứ 4',
    '5': 'Thứ 5',
    '6': 'Thứ 6',
    '7': 'Thứ 7',
    '8': 'Chủ nhật',
  };

  return Object.entries(timetable || {}).map(([day, slots]) => {
    return h('div', { class: 'mb-1' }, [
      h('span', { class: 'font-medium' }, `${days[day]}: `),
      h('span', {}, slots.join(', ')),
    ]);
  });
};

export const columns: AugmentedColumnDef<LabManagedByAdmin>[] = [
  {
    id: 'name',
    title: 'Tên phòng',
    cell: ({ row }) =>
      h(
        'div',
        {
          class: 'flex items-center gap-2',
        },
        [
          h(Icon, {
            name: 'i-heroicons-beaker',
            class: 'w-5 h-5 text-blue-500',
          }),
          h('span', { class: 'text-gray-700 font-medium' }, row.original.name),
        ],
      ),
    enableSorting: true,
  },
  {
    id: 'room',
    title: 'Phòng',
    cell: ({ row }) => h('span', { class: 'text-gray-600' }, row.original.room),
    enableSorting: true,
  },
  {
    id: 'faculty',
    title: 'Khoa',
    cell: ({ row }) =>
      h('span', { class: 'text-gray-600' }, row.original.faculty),
    enableSorting: true,
  },
  {
    id: 'branch',
    title: 'Cơ sở',
    cell: ({ row }) =>
      h('span', { class: 'text-gray-600' }, row.original.branch),
    enableSorting: true,
  },
  {
    id: 'timetable',
    title: 'Lịch hoạt động',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-sm text-gray-600' },
        row.original.timetable
          ? formatTimetable(row.original.timetable)
          : 'Chưa có lịch',
      ),
  },
  {
    id: 'actions',
    title: 'Thao tác',
    cell: ({ row }) =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(
          Button,
          {
            variant: 'ghost',
            size: 'icon',
            onClick: () => console.log('Edit:', row.original),
            class: 'hover:text-blue-500',
          },
          [
            h(Icon, {
              name: 'i-heroicons-pencil-square',
              class: 'w-5 h-5',
            }),
          ],
        ),
        h(
          Button,
          {
            variant: 'ghost',
            size: 'icon',
            onClick: () => console.log('Delete:', row.original),
            class: 'hover:text-red-500',
          },
          [
            h(Icon, {
              name: 'i-heroicons-trash',
              class: 'w-5 h-5',
            }),
          ],
        ),
      ]),
  },
];
