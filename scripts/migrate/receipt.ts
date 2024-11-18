import pg from 'pg';
import { config as configEnv } from 'dotenv';
import { Readable } from 'stream';
import { from as copyFrom } from 'pg-copy-streams';

configEnv();

type ReturnProgress = 'on_time' | 'late';

interface DeviceKind {
  id: number;
  available_quantity: {
    [labId: string]: number;
  };
}

interface MockReceiptOptions {
  startDate?: Date;
  endDate?: Date;
  numberOfRecords?: number;
}

interface Receipt {
  borrower_id: string;
  checker_id: string | null;
  quantity: number;
  borrowed_at: Date;
  expected_returned_at: Date;
  returned_at: Date | null;
  device_kind_id: number;
  lab_id: string;
  progress: ReturnProgress | null;
}

interface LabAllocation {
  labId: string;
  quantity: number;
}

interface AllocatedQuantities {
  [key: string]: number;
}

const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

const findAvailableLabs = (
  deviceKinds: DeviceKind[],
  deviceKindId: number,
  requestedQuantity: number,
  allocatedQuantities: AllocatedQuantities,
): LabAllocation[] | null => {
  const deviceKind = deviceKinds.find((dk) => dk.id === deviceKindId);
  if (!deviceKind) return null;

  const totalAvailable = Object.entries(deviceKind.available_quantity).reduce(
    (sum, [labId, qty]) => {
      const key = `${deviceKindId}:${labId}`;
      const allocated = allocatedQuantities[key] || 0;
      return sum + (qty - allocated);
    },
    0,
  );

  if (totalAvailable < requestedQuantity) return null;

  const allocations: LabAllocation[] = [];
  let remainingQuantity = requestedQuantity;

  const sortedLabs = Object.entries(deviceKind.available_quantity).sort(
    ([, a], [, b]) => b - a,
  );

  for (const [labId, availableQty] of sortedLabs) {
    if (remainingQuantity <= 0) break;

    const key = `${deviceKindId}:${labId}`;
    const allocatedQty = allocatedQuantities[key] || 0;
    const quantityToAllocate = Math.min(
      availableQty - allocatedQty,
      remainingQuantity,
    );
    if (quantityToAllocate > 0) {
      allocations.push({
        labId,
        quantity: quantityToAllocate,
      });
      remainingQuantity -= quantityToAllocate;
      allocatedQuantities[key] =
        (allocatedQuantities[key] || 0) + quantityToAllocate;
    }
  }

  return allocations;
};

const generateReceipt = (
  deviceKinds: DeviceKind[],
  userIds: string[],
  options: { minDate: Date; maxDate: Date },
  allocatedQuantities: AllocatedQuantities,
): Receipt[] => {
  const borrowedAt = randomDate(options.minDate, options.maxDate);
  const expectedReturnDays = Math.floor(Math.random() * 14) + 1;
  const expectedReturnedAt = new Date(borrowedAt);
  expectedReturnedAt.setDate(borrowedAt.getDate() + expectedReturnDays);

  const isReturned = Math.random() > 0.3;
  let returnedAt = null;
  let progress: ReturnProgress | null = null;

  if (isReturned) {
    const maxReturnDelay = 5;
    const returnDelay =
      Math.floor(Math.random() * (maxReturnDelay * 2)) - maxReturnDelay;
    returnedAt = new Date(expectedReturnedAt);
    returnedAt.setDate(expectedReturnedAt.getDate() + returnDelay);
    progress = returnedAt > expectedReturnedAt ? 'late' : 'on_time';
  }

  let validDeviceKindId: number | null = null;
  while (validDeviceKindId === null) {
    const randomIndex = Math.floor(Math.random() * deviceKinds.length);
    const randomDeviceKind = deviceKinds[randomIndex];
    if (randomDeviceKind) {
      validDeviceKindId = randomDeviceKind.id;
    }
  }

  const quantity = Math.floor(Math.random() * 100) + 1;

  const labAllocations = findAvailableLabs(
    deviceKinds,
    validDeviceKindId,
    quantity,
    allocatedQuantities,
  );
  if (!labAllocations) {
    return [];
  }

  const borrowerId = userIds[Math.floor(Math.random() * userIds.length)];
  const checkerId = isReturned
    ? userIds[Math.floor(Math.random() * userIds.length)]
    : null;

  return labAllocations.map((allocation) => ({
    borrower_id: borrowerId,
    checker_id: checkerId,
    quantity: allocation.quantity,
    borrowed_at: borrowedAt,
    expected_returned_at: expectedReturnedAt,
    returned_at: returnedAt,
    device_kind_id: validDeviceKindId,
    lab_id: allocation.labId,
    progress,
  }));
};

const receiptToCopyFormat = (receipt: Receipt): string => {
  return (
    [
      receipt.borrower_id,
      receipt.checker_id || '\\N',
      receipt.quantity,
      receipt.borrowed_at.toISOString(),
      receipt.expected_returned_at.toISOString(),
      receipt.returned_at ? receipt.returned_at.toISOString() : '\\N',
      receipt.device_kind_id,
      receipt.lab_id,
      receipt.progress || 'on_time',
    ].join('\t') + '\n'
  );
};

async function* generateReceiptData (
  deviceKinds: DeviceKind[],
  userIds: string[],
  options: Required<MockReceiptOptions>,
) {
  let generated = 0;
  const allocatedQuantities: AllocatedQuantities = {};
  while (generated < options.numberOfRecords) {
    const receipts = generateReceipt(
      deviceKinds,
      userIds,
      {
        minDate: options.startDate,
        maxDate: options.endDate,
      },
      allocatedQuantities,
    );

    for (const receipt of receipts) {
      yield receiptToCopyFormat(receipt);
    }
    generated++;
  }
}

const createReceiptStream = (
  deviceKinds: DeviceKind[],
  userIds: string[],
  options: Required<MockReceiptOptions>,
) => {
  const generator = generateReceiptData(deviceKinds, userIds, options);
  return Readable.from(generator);
};

const fetchRequiredData = async (pool: pg.Pool) => {
  const [deviceKindsResult, userIdsResult] = await Promise.all([
    pool.query('SELECT id, available_quantity FROM device_kinds'),
    pool.query('SELECT id FROM users'),
  ]);

  return {
    deviceKinds: deviceKindsResult.rows,
    userIds: userIdsResult.rows.map((row) => row.id),
  };
};

const generateMockData = async (
  pool: pg.Pool,
  options: MockReceiptOptions = {},
): Promise<void> => {
  console.log('Starting mock data generation with COPY...');
  const startTime = Date.now();

  const { deviceKinds, userIds } = await fetchRequiredData(pool);
  const finalOptions = {
    startDate:
      options.startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    endDate: options.endDate || new Date(),
    numberOfRecords: options.numberOfRecords || 100,
  };

  const client = await pool.connect();
  try {
    const receiptStream = createReceiptStream(
      deviceKinds,
      userIds,
      finalOptions,
    );

    const copyStream = client.query(
      copyFrom(`
      COPY receipts (
        borrower_id, checker_id, quantity,
        borrowed_at, expected_returned_at, returned_at,
        device_kind_id, lab_id, progress      
      ) FROM STDIN WITH (FORMAT text, NULL '\\N')
    `),
    );

    await new Promise((resolve, reject) => {
      receiptStream.pipe(copyStream).on('finish', resolve).on('error', reject);
    });

    const totalTime = (Date.now() - startTime) / 1000;
    console.log(
      `Completed inserting ${finalOptions.numberOfRecords.toLocaleString()} records in ${totalTime.toFixed(2)} seconds`,
    );
  } finally {
    client.release();
  }
};

const mockData = async () => {
  const pool = new pg.Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    max: 20,
  });

  try {
    await generateMockData(pool, {
      startDate: new Date('2024-01-01'),
      endDate: new Date(),
      numberOfRecords: 50000000,
    });
  } catch (error) {
    console.error('Error generating mock data:', error);
  } finally {
    await pool.end();
  }
};

mockData();
