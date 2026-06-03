-- Run this in Supabase SQL Editor (one time only)
-- This RPC lets Node.js run raw SQL via @supabase/supabase-js over HTTPS (IPv4)

CREATE OR REPLACE FUNCTION execute_sql(
  query_text TEXT,
  p1 TEXT DEFAULT NULL, p2 TEXT DEFAULT NULL, p3 TEXT DEFAULT NULL,
  p4 TEXT DEFAULT NULL, p5 TEXT DEFAULT NULL, p6 TEXT DEFAULT NULL,
  p7 TEXT DEFAULT NULL, p8 TEXT DEFAULT NULL, p9 TEXT DEFAULT NULL,
  p10 TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  row_count INTEGER;
BEGIN
  -- Try as returning query (SELECT / INSERT ... RETURNING / etc.)
  BEGIN
    EXECUTE format(
      'WITH _cte AS (%s) SELECT COALESCE(jsonb_agg(row_to_json(_cte)), ''[]''::jsonb) FROM _cte',
      query_text
    ) INTO result
    USING p1, p2, p3, p4, p5, p6, p7, p8, p9, p10;

    RETURN result;
  EXCEPTION
    WHEN OTHERS THEN
      -- Non-returning query (INSERT / UPDATE / DELETE without RETURNING)
      EXECUTE query_text
      USING p1, p2, p3, p4, p5, p6, p7, p8, p9, p10;

      GET DIAGNOSTICS row_count = ROW_COUNT;
      RETURN jsonb_build_object('rowCount', row_count);
  END;
END;
$$;
