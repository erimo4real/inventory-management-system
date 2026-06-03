import dotenv from 'dotenv';

dotenv.config();

function buildRpcBody(sql, params = []) {
  const body = { query_text: sql };
  for (let i = 0; i < Math.min(params.length, 10); i++) {
    body[`p${i + 1}`] = params[i] == null ? null : String(params[i]);
  }
  return body;
}

let _url = null;
let _key = null;

function getEndpoint() {
  if (!_url || !_key) {
    _url = process.env.SUPABASE_URL;
    _key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!_url || !_key) {
      throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
    }
    _url = _url.replace(/\/$/, '');
  }
  return { url: `${_url}/rest/v1/rpc/execute_sql`, key: _key };
}

async function executeRpc(sql, params) {
  const { url, key } = getEndpoint();
  const body = buildRpcBody(sql, params);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(text || res.statusText);
    err.code = res.status;
    throw err;
  }

  const data = await res.json();

  if (data && typeof data === 'object' && data.rowCount !== undefined) {
    return { rows: [], rowCount: data.rowCount };
  }

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
  on: () => {},
};

export default pool;
