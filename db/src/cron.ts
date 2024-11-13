import { Client } from "pg";

const client = new Client({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.POSTGRES_HOST || "postgres-db",
  database: process.env.POSTGRES_DB || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
  port: Number(process.env.POSTGRES_PORT) || 5432,
});
client.connect();

async function refreshViews() {
  try {
    await client.query("REFRESH MATERIALIZED VIEW klines_1m");
    await client.query("REFRESH MATERIALIZED VIEW klines_1h");
    await client.query("REFRESH MATERIALIZED VIEW klines_1w");
    console.log("Materialized views refreshed successfully");
  } catch (error) {
    console.error("Error refreshing views:", error);
  }
}

// Refresh every 10 seconds
setInterval(refreshViews, 10000);
