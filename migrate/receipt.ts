import type { Client } from 'pg';
import pg from 'pg';
import { config as configEnv } from 'dotenv';
configEnv();

// Types
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

const BATCH_SIZE = 1000; // Configure batch size for optimal performance

// Helper function to generate random date between two dates
const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

// Helper function to find available labs and allocate quantities
const findAvailableLabs = (
  deviceKinds: DeviceKind[],
  deviceKindId: number,
  requestedQuantity: number,
): LabAllocation[] | null => {
  const deviceKind = deviceKinds.find((dk) => dk.id === deviceKindId);
  if (!deviceKind) return null;

  // Calculate total available quantity across all labs
  const totalAvailable = Object.values(deviceKind.available_quantity).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  // If total available is less than requested, return null
  if (totalAvailable < requestedQuantity) return null;

  const allocations: LabAllocation[] = [];
  let remainingQuantity = requestedQuantity;

  // Sort labs by available quantity in descending order
  const sortedLabs = Object.entries(deviceKind.available_quantity).sort(
    ([, a], [, b]) => b - a,
  );

  for (const [labId, availableQty] of sortedLabs) {
    if (remainingQuantity <= 0) break;

    const quantityToAllocate = Math.min(availableQty, remainingQuantity);
    if (quantityToAllocate > 0) {
      allocations.push({
        labId,
        quantity: quantityToAllocate,
      });
      remainingQuantity -= quantityToAllocate;
    }
  }

  return allocations;
};

// Generate receipts for a single borrow transaction
const generateReceipt = (
  deviceKinds: DeviceKind[],
  userIds: string[],
  options: { minDate: Date; maxDate: Date },
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

  const deviceKindId =
    deviceKinds[Math.floor(Math.random() * deviceKinds.length)].id;
  const quantity = Math.floor(Math.random() * 5) + 1;

  const labAllocations = findAvailableLabs(deviceKinds, deviceKindId, quantity);
  if (!labAllocations) {
    // Try again with a different device kind or smaller quantity
    return generateReceipt(deviceKinds, userIds, options);
  }

  const borrowerId = userIds[Math.floor(Math.random() * userIds.length)];
  const checkerId = isReturned
    ? userIds[Math.floor(Math.random() * userIds.length)]
    : null;

  // Create a receipt for each lab allocation
  return labAllocations.map((allocation) => ({
    borrower_id: borrowerId,
    checker_id: checkerId,
    quantity: allocation.quantity,
    borrowed_at: borrowedAt,
    expected_returned_at: expectedReturnedAt,
    returned_at: returnedAt,
    device_kind_id: deviceKindId,
    lab_id: allocation.labId,
    progress,
  }));
};

// Generate receipts in batches
const generateReceiptBatches = async function* (
  deviceKinds: DeviceKind[],
  userIds: string[],
  options: MockReceiptOptions = {},
): AsyncGenerator<Receipt[]> {
  const {
    startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    endDate = new Date(),
    numberOfRecords = 100,
  } = options;

  let generatedCount = 0;
  let currentBatch: Receipt[] = [];

  while (generatedCount < numberOfRecords) {
    const receipts = generateReceipt(deviceKinds, userIds, {
      minDate: startDate,
      maxDate: endDate,
    });

    currentBatch.push(...receipts);
    generatedCount++;

    if (currentBatch.length >= BATCH_SIZE) {
      yield currentBatch;
      currentBatch = [];
    }
  }

  if (currentBatch.length > 0) {
    yield currentBatch;
  }
};

// Fetch required data from database
const fetchRequiredData = async (client: Client) => {
  const [deviceKindsResult, userIdsResult] = await Promise.all([
    client.query('SELECT id, available_quantity FROM device_kinds'),
    client.query('SELECT id FROM users'),
  ]);

  return {
    deviceKinds: deviceKindsResult.rows,
    userIds: userIdsResult.rows.map((row) => row.id),
  };
};

// Prepare the bulk insert query
const prepareBulkInsertQuery = (batchSize: number): string => {
  const valuePlaceholders = Array.from({ length: batchSize }, (_, i) => {
    const offset = i * 10;
    return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${
      offset + 5
    }, $${offset + 6}, $${offset + 7}, $${offset + 8}, $${offset + 9}, $${
      offset + 10
    })`;
  }).join(',');

  return `
    INSERT INTO receipts (
      borrower_id, checker_id, quantity,
      borrowed_at, expected_returned_at, returned_at,
      device_kind_id, lab_id, progress, status
    ) VALUES ${valuePlaceholders}
  `;
};

// Insert receipts in batches
const insertReceiptBatch = async (
  client: Client,
  receipts: Receipt[],
): Promise<void> => {
  const values: (string | number | Date | null)[] = [];

  receipts.forEach((receipt) => {
    values.push(
      receipt.borrower_id,
      receipt.checker_id,
      receipt.quantity,
      receipt.borrowed_at,
      receipt.expected_returned_at,
      receipt.returned_at,
      receipt.device_kind_id,
      receipt.lab_id,
      receipt.progress || 'on_time',
    );
  });

  const query = prepareBulkInsertQuery(receipts.length);
  await client.query(query, values);
};

// Main function to generate and insert mock data
const generateMockData = async (
  client: Client,
  options: MockReceiptOptions = {},
): Promise<void> => {
  console.log('Starting mock data generation...');
  const startTime = Date.now();

  const { deviceKinds, userIds } = await fetchRequiredData(client);
  let insertedCount = 0;

  // Process batches
  for await (const batch of generateReceiptBatches(
    deviceKinds,
    userIds,
    options,
  )) {
    await insertReceiptBatch(client, batch);
    insertedCount += batch.length;

    if (insertedCount % 10000 === 0) {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const recordsPerSecond = insertedCount / elapsedSeconds;
      console.log(
        `Inserted ${insertedCount.toLocaleString()} records. ` +
          `Speed: ${Math.round(recordsPerSecond)} records/second`,
      );
    }
  }

  const totalTime = (Date.now() - startTime) / 1000;
  console.log(
    `Completed inserting ${insertedCount.toLocaleString()} records in ${totalTime.toFixed(2)} seconds`,
  );
};

// Example usage
const mockData = async () => {
  const { Client } = pg;
  const dbClient = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_DATABASE,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT || '5432'),
  });

  try {
    await dbClient.connect();

    // Configure connection for better bulk insert performance
    await dbClient.query('SET session_replication_role = replica;'); // Temporarily disable triggers and constraints
    await dbClient.query('SET synchronous_commit = off;'); // Disable synchronous commits for better performance

    await generateMockData(dbClient, {
      startDate: new Date('2024-01-01'),
      endDate: new Date(),
      numberOfRecords: 1000000,
    });
  } catch (error) {
    console.error('Error generating mock data:', error);
  } finally {
    // Reset connection settings
    await dbClient.query('SET session_replication_role = DEFAULT;');
    await dbClient.query('SET synchronous_commit = on;');
    await dbClient.end();
  }
};

mockData();
