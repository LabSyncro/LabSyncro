import type {
  DeviceCheckerResourceDto,
  ListOfDeviceResourceDto,
  PrintQRCodeDto,
} from '~/lib/api_schema';

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
    labId?: string,
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
        lab_id: labId,
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
      'https://15c1-171-252-153-91.ngrok-free.app/print_labels',
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

  async checkDevice (
    deviceId: string,
    lab_id: string,
  ): Promise<DeviceCheckerResourceDto> {
    return await $fetch(`/api/devices/${deviceId}/checked`, {
      method: 'POST',
      body: {
        lab_id,
      },
    });
  },
};
