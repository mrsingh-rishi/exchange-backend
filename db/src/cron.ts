import { Client } from "pg";

const client = new Client({
  user: "your_user",
  host: "localhost",
  database: "my_database",
  password: "your_password",
  port: 5432,
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
