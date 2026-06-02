import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const poolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  family: 4,
};

if (process.env.DATABASE_URL) {
  poolConfig.connectionString = process.env.DATABASE_URL;
  // Supabase requires SSL. Enable by default when using DATABASE_URL.
  // Override with DB_SSL=false to disable.
  // Set DB_SSL_REJECT_UNAUTHORIZED=true to enforce certificate validation.
  if (process.env.DB_SSL !== 'false') {
    const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
    poolConfig.ssl = { rejectUnauthorized };
  }
} else {
  poolConfig.host = process.env.DB_HOST || 'localhost';
  poolConfig.port = parseInt(process.env.DB_PORT) || 5432;
  poolConfig.database = process.env.DB_NAME || 'inventory_db';
  poolConfig.user = process.env.DB_USER || 'postgres';
  poolConfig.password = process.env.DB_PASSWORD || 'postgres';
  // Enable SSL explicitly with DB_SSL=true
  if (process.env.DB_SSL === 'true') {
    const rejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true';
    poolConfig.ssl = { rejectUnauthorized };
  }
}

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
