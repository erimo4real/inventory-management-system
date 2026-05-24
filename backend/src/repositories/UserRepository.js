import pool from '../config/db.js';

export default class UserRepository {
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    return result.rows[0];
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, role, site_id, is_active, avatar_url, avatar_public_id, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findOrCreateDefaultSite() {
    const existing = await pool.query("SELECT id FROM sites WHERE slug = 'default' LIMIT 1");
    if (existing.rows.length > 0) {
      return existing.rows[0].id;
    }
    
    const result = await pool.query(
      `INSERT INTO sites (name, slug, address, email) 
       VALUES ('Default Site', 'default', 'Default Address', 'system@local') 
       RETURNING id`
    );
    return result.rows[0].id;
  }

  async create(data) {
    const { name, email, password, role, site_id } = data;
    
    let siteId = site_id;
    if (!siteId) {
      siteId = await this.findOrCreateDefaultSite();
    }

    const result = await pool.query(
      `INSERT INTO users (site_id, name, email, password, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, site_id, is_active, avatar_url, avatar_public_id, created_at`,
      [siteId, name, email, password, role || 'staff']
    );
    return result.rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'email', 'password', 'role', 'is_active', 'avatar_url', 'avatar_public_id'];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, role, is_active, avatar_url, avatar_public_id, created_at`,
      values
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      'UPDATE users SET is_active = false WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query(
      'SELECT id, name, email, role, is_active, avatar_url, created_at FROM users WHERE is_active = true ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async updateAvatar(id, avatarUrl, avatarPublicId) {
    const result = await pool.query(
      'UPDATE users SET avatar_url = $1, avatar_public_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, avatar_url, avatar_public_id',
      [avatarUrl, avatarPublicId, id]
    );
    return result.rows[0];
  }

  async countUsers() {
    const result = await pool.query('SELECT COUNT(*) as count FROM users WHERE is_active = true');
    return parseInt(result.rows[0].count, 10);
  }

  async changePassword(id, newPassword) {
    const result = await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2 RETURNING id',
      [newPassword, id]
    );
    return result.rows[0];
  }

  async setResetToken(email, token, expires) {
    const result = await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3 AND is_active = true RETURNING id',
      [token, expires, email]
    );
    return result.rows[0];
  }

  async findByResetToken(token) {
    const result = await pool.query(
      'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW() AND is_active = true',
      [token]
    );
    return result.rows[0];
  }

  async incrementFailedAttempts(id) {
    await pool.query(
      "UPDATE users SET failed_attempts = COALESCE(failed_attempts, 0) + 1 WHERE id = $1",
      [id]
    );
  }

  async resetFailedAttempts(id) {
    await pool.query(
      "UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = $1",
      [id]
    );
  }

  async lockAccount(id, durationMinutes = 15) {
    await pool.query(
      "UPDATE users SET locked_until = NOW() + ($1 || ' minutes')::interval WHERE id = $2",
      [String(durationMinutes), id]
    );
  }

  async isAccountLocked(id) {
    const result = await pool.query(
      "SELECT locked_until FROM users WHERE id = $1 AND locked_until > NOW()",
      [id]
    );
    return result.rows.length > 0;
  }
}
