export function sanitizeSearch(value) {
  if (!value || typeof value !== 'string') return ''
  return value.trim().replace(/['";\\%_]/g, '').slice(0, 200)
}
