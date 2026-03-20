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
      'SELECT id, name, email, role, is_active, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async create(data) {
    const { name, email, password, role } = data;
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, is_active, created_at`,
      [name, email, password, role || 'staff']
    );
    return result.rows[0];
  }

  async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    const allowedFields = ['name', 'email', 'password', 'role', 'is_active'];

    for (const [key, value] of Object.entries(data)) {
      if (allowedFields.includes(key) && value !== undefined) {
        fields.push(`${key} = $${paramCount++}`);
        values.push(value);
      }
    }

    if (fields.length === 0) return null;

    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, name, email, role, is_active, created_at`,
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
      'SELECT id, name, email, role, is_active, created_at FROM users WHERE is_active = true ORDER BY created_at DESC'
    );
    return result.rows;
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
}
