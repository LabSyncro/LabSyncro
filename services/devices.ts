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

  async getLastDeviceId (): Promise<string> {
    return await $fetch('/api/devices', {
      query: {
        sort_field: 'id',
        desc: true,
        length: 1,
        offset: 0,
      },
    }).then((res) => res.devices[0].id);
  },

  async createDevices (
    devices: { kind: string; lab_id: string }[],
  ): Promise<{ id: string }[]> {
    return await $fetch('/api/devices', {
      method: 'POST',
      body: devices.map((device) => ({
        kind: device.kind,
        labId: device.lab_id,
      })),
    });
  },

  async printQRCode ({ devices }: { devices: PrintQRCodeDto[] }): Promise<void> {
    return await $fetch(
      'https://b96d-171-252-153-91.ngrok-free.app/print_labels',
      {
        method: 'POST',
        body: { devices },
      },
    );
  },
};
