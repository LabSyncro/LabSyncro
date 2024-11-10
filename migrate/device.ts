import pg from "pg";
import fs from "fs";
import { from as copyFrom } from "pg-copy-streams";
import { config as configEnv } from "dotenv";

configEnv();

async function insertMockDevicesData() {
  const { Client } = pg;
  const dbClient = new Client({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: parseInt(process.env.DATABASE_PORT || "5432"),
  });

  await dbClient.connect();

  const getRandomItem = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)];

  // Fetch device kinds and labs data
  const deviceKindsResult = await dbClient.query(
    "SELECT id, total_quantity FROM device_kinds LIMIT 0",
  );
  const deviceKinds = deviceKindsResult.rows;

  const labsResult = await dbClient.query("SELECT id FROM labs");
  const labIds = labsResult.rows.map((row) => row.id);

  const deviceStatuses = [
    "available",
    "borrowing",
    "shipping",
    "assessing",
    "maintaining",
    "discarded",
  ];

  // Temporary CSV file path
  const tempFilePath = "temp_devices_data_test.csv";

  // Create a writable stream for the CSV file
  const fileStream = fs.createWriteStream(tempFilePath);

  // Write data to the CSV file
  for (const deviceKind of deviceKinds) {
    for (let i = 0; i < deviceKind.total_quantity; i++) {
      const row = `${deviceKind.id},${getRandomItem(labIds)},{},${getRandomItem(deviceStatuses)}\n`;
      fileStream.write(row);
    }
  }

  // Close the file stream after writing all data
  fileStream.end();

  // Wait for the file to be fully written before proceeding with the COPY operation
  await new Promise((resolve, reject) => {
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });

  try {
    await dbClient.query("BEGIN");

    // Open the file and create a readable stream for COPY
    const copyStream = dbClient.query(
      copyFrom("COPY devices_test (kind, lab_id, meta, status) FROM STDIN CSV"),
    );
    const readStream = fs.createReadStream(tempFilePath);

    // Pipe the CSV file data into the COPY command
    readStream.pipe(copyStream);

    // Wait for the copy operation to complete
    await new Promise((resolve, reject) => {
      copyStream.on("end", resolve);
      copyStream.on("error", reject);
    });

    await dbClient.query("COMMIT");
    console.log("Data generation completed successfully");
  } catch (error) {
    await dbClient.query("ROLLBACK");
    console.error("Error generating data:", error);
    throw error;
  } finally {
    await dbClient.end();

    // Delete the temporary file after the COPY operation
    fs.unlink(tempFilePath, (err) => {
      if (err) console.error("Failed to delete temp file:", err);
    });
  }
}

insertMockDevicesData().catch((error) =>
  console.error("Processing failed:", error),
);
