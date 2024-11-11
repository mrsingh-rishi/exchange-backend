import { Client } from "pg";

const client = new Client({
  user: "your_user",
  host: "localhost",
  database: "my_database",
  password: "your_password",
  port: 5432,
});

async function initializeDB() {
  await client.connect();

  // Drop and recreate `tata_prices` table
  await client.query(`
      DROP TABLE IF EXISTS "TataPrice";
      CREATE TABLE "TataPrice" (
          time TIMESTAMPTZ NOT NULL,
          price DOUBLE PRECISION,
          volume DOUBLE PRECISION,
          currency_code VARCHAR(10)
      );
  `);

  // Create a hypertable (specific to TimescaleDB)
  await client.query(`
      SELECT create_hypertable('TataPrice', 'time', if_not_exists => TRUE);
  `);

  // Create materialized views for different time intervals
  await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1m AS
      SELECT
          time_bucket('1 minute', time) AS bucket,
          first(price, time) AS open,
          max(price) AS high,
          min(price) AS low,
          last(price, time) AS close,
          sum(volume) AS volume,
          currency_code
      FROM "TataPrice"
      GROUP BY bucket, currency_code;
  `);

  await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1h AS
      SELECT
          time_bucket('1 hour', time) AS bucket,
          first(price, time) AS open,
          max(price) AS high,
          min(price) AS low,
          last(price, time) AS close,
          sum(volume) AS volume,
          currency_code
      FROM "TataPrice"
      GROUP BY bucket, currency_code;
  `);

  await client.query(`
      CREATE MATERIALIZED VIEW IF NOT EXISTS klines_1w AS
      SELECT
          time_bucket('1 week', time) AS bucket,
          first(price, time) AS open,
          max(price) AS high,
          min(price) AS low,
          last(price, time) AS close,
          sum(volume) AS volume,
          currency_code
      FROM "TataPrice"
      GROUP BY bucket, currency_code;
  `);

  await client.end();
  console.log("Database initialized successfully");
}

initializeDB().catch(console.error);
