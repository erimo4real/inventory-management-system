import pg from 'pg';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const { Pool } = pg;

function parseDbUrl(url) {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: parseInt(parsed.port) || 5432,
      database: parsed.pathname.replace(/^\//, ''),
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      ssl: process.env.DB_SSL !== 'false' ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' } : undefined,
    };
  } catch {
    return null;
  }
}

const poolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  family: 4,
};

if (process.env.DATABASE_URL) {
  const parsed = parseDbUrl(process.env.DATABASE_URL);
  if (parsed) {
    Object.assign(poolConfig, parsed);
  } else {
    poolConfig.connectionString = process.env.DATABASE_URL;
  }
} else {
  poolConfig.host = process.env.DB_HOST || 'localhost';
  poolConfig.port = parseInt(process.env.DB_PORT) || 5432;
  poolConfig.database = process.env.DB_NAME || 'inventory_db';
  poolConfig.user = process.env.DB_USER || 'postgres';
  poolConfig.password = process.env.DB_PASSWORD || 'postgres';
  if (process.env.DB_SSL === 'true') {
    poolConfig.ssl = { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' };
  }
}

export const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export default pool;
