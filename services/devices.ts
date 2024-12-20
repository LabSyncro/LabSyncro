import type { ListOfDeviceResourceDto, PrintQRCodeDto } from '~/lib/api_schema';

export const deviceService = {
  async getByKind (
    kindId: string,
    offset: number,
    length: number,
    {
      searchText = undefined,
      searchFields = [],
      sortField = undefined,
      desc = false,
    }: {
      searchText?: string;
      searchFields?: 'device_id'[];
      sortField?: 'name' | 'id';
      desc?: boolean;
    },
  ): Promise<ListOfDeviceResourceDto> {
    return await $fetch('/api/devices', {
      query: {
        device_kind_id: kindId,
        offset,
        length,
        search_text: searchText,
        search_fields: searchFields,
        desc,
        sort_field: sortField,
      },
    });
  },

  async createDevices (
    devices: { deviceKindId: string; labId: string }[],
  ): Promise<{ id: string }[]> {
    return await $fetch('/api/devices', {
      method: 'POST',
      body: devices.map((device) => ({
        kind: device.deviceKindId,
        lab_id: device.labId,
      })),
    });
  },

  async printQRCode ({ devices }: { devices: PrintQRCodeDto[] }): Promise<void> {
    return await $fetch(
      'https://531f-171-252-153-91.ngrok-free.app/print_labels',
      {
        method: 'POST',
        body: { devices },
      },
    );
  },

  async updatePrintedAt (
    devices: { id: string; printedAt: Date }[],
  ): Promise<void> {
    return await $fetch('/api/devices/printed', {
      method: 'PATCH',
      body: devices.map((device) => ({
        id: device.id,
        printed_at: device.printedAt,
      })),
    });
  },
};
