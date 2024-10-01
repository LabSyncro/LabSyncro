import pg from 'pg';

export const initDbClient = async () => {
  const { dbHost, dbUser, dbPort, dbDatabase, dbPassword } = useRuntimeConfig();

  const dbClient = new pg.Client({
    user: dbUser,
    host: dbHost,
    database: dbDatabase,
    password: dbPassword,
    port: parseInt(dbPort || '5432'),
  });

  await dbClient.connect();

  return dbClient;
};
