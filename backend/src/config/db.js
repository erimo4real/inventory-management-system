import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const MAX_PARAMS = 10;

function buildRpcArgs(sql, params = []) {
  const args = { query_text: sql };
  for (let i = 0; i < Math.min(params.length, MAX_PARAMS); i++) {
    args[`p${i + 1}`] = params[i] == null ? null : String(params[i]);
  }
  return args;
}

let _rpcClient = null;

function getClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  }

  if (!_rpcClient) {
    _rpcClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return _rpcClient;
}

async function executeRpc(sql, params) {
  const supabase = getClient();
  const args = buildRpcArgs(sql, params);

  const { data, error } = await supabase.rpc('execute_sql', args);

  if (error) {
    const err = new Error(error.message);
    err.code = error.code;
    throw err;
  }

  // Non-returning query (INSERT/UPDATE/DELETE without RETURNING)
  if (data && typeof data === 'object' && data.rowCount !== undefined) {
    return { rows: [], rowCount: data.rowCount };
  }

  // Returning query (SELECT / INSERT ... RETURNING)
  const rows = Array.isArray(data) ? data : [];
  return { rows, rowCount: rows.length };
}

function createClientProxy() {
  let released = false;
  return {
    query: async (sql, params) => {
      if (released) throw new Error('Client already released');
      const upper = typeof sql === 'string' ? sql.trim().toUpperCase() : '';
      if (upper === 'BEGIN' || upper === 'COMMIT' || upper === 'ROLLBACK') {
        return { rows: [], rowCount: 0 };
      }
      return executeRpc(sql, params);
    },
    release: () => { released = true; },
  };
}

export const pool = {
  query: async (sql, params) => executeRpc(sql, params),
  connect: async () => createClientProxy(),
  on: () => {}, // no-op for error handler compatibility
};

export default pool;
