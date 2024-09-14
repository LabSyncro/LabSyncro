import { Client } from "pg";

declare module "#app" {
  interface NuxtApp {
    $dbClient: Client;
  }
}

export default defineNuxtPlugin({
  name: "dbClient",
  async setup() {
    const client = new Client({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || "5432"),
    });

    await client.connect();

    return {
      provide: {
        dbClient: client,
      },
    };
  },
});
