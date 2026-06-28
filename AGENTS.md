## Security & Code Quality Standards

### Security Audit Process
Before declaring any feature complete, run a per-module security audit using an AI assistant with this prompt structure:

1. **Authentication & Authorization** — weak auth, missing role checks, broken access control
2. **Input Validation & Injection** — SQL injection, XSS, command injection, unvalidated input
3. **Data Exposure** — hardcoded secrets, API keys in code, sensitive data in logs/responses
4. **Dependencies** — outdated packages with known CVEs, unnecessary deps
5. **API Security** — missing rate limiting, exposed endpoints, improper CORS config
6. **Error Handling** — stack traces leaked to users, verbose error messages
7. **Session Management** — insecure cookies, missing HTTPS enforcement, weak token handling
8. **File & Storage Security** — unrestricted uploads, insecure cloud storage permissions

### Mandatory Checks (every project)
- Run `gitleaks` or `truffleHog` on git history before committing secrets
- Run `npm audit` (or language equivalent) and fix HIGH/CRITICAL
- `JWT_SECRET` must be a strong random value, never default
- Set `sameSite: 'Strict'` on all cookies
- Add CSRF header check (`X-Requested-With: XMLHttpRequest`) on state-changing API methods
- Add rate limiting on auth endpoints and upload endpoints
- Sanitize search/user input — parameterized queries for all DB access, never concatenation
- Validate file uploads: MIME type, size limit, no executable extensions
- Never expose `err.message` or stack traces to API responses

### Code Review After AI Fixes
- Review every AI-proposed security fix; AI can introduce new issues
- Verify with `node --check` (or language equivalent) and build
- Do not blindly apply suggestions

### Verification
After changes, always verify:
- `node --check` passes for all backend files
- Vite/webpack build succeeds with 0 errors
- Server starts without warnings

## Supabase REST API Pattern (preferred over pg Pool)

When connecting to Supabase from a backend deployed on platforms like Render (IPv4-only):
- **DO NOT** use `pg` Pool with direct database connection — Supabase direct host (`db.<project>.supabase.co:5432`) is IPv6-only
- **DO NOT** use `@supabase/supabase-js` package — it adds a dependency that may cause install issues on some platforms
- **DO** create an `execute_sql` RPC function in Supabase SQL Editor (see `backend/src/config/execute_sql.sql`)
- **DO** use raw `fetch()` to call `POST /rest/v1/rpc/execute_sql` with the RPC parameters
- The Supabase REST API endpoint (`https://<project>.supabase.co`) is always IPv4-reachable
- Pattern: `pool.query()` interface with a thin wrapper that translates SQL → RPC call → JSON response
- BEGIN/COMMIT/ROLLBACK are no-ops (each REST call is a separate session) — individual statements must be atomic
