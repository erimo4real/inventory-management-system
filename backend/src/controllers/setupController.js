import bcrypt from 'bcryptjs';
import UserRepository from '../repositories/UserRepository.js';
import pool from '../config/db.js';

const userRepo = new UserRepository();

export const initializeSystem = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || typeof name !== 'string' || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' });
    }

    if (password.length < 6 || password.length > 128) {
      return res.status(400).json({ error: 'Password must be between 6 and 128 characters' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      const userCount = await client.query('SELECT COUNT(*) FROM users WHERE is_active = true');
      
      if (parseInt(userCount.rows[0].count) > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'System already initialized. Please use the login page.' });
      }

      let siteResult = await client.query("SELECT id FROM sites WHERE slug = 'default' LIMIT 1");
      let siteId;
      
      if (siteResult.rows.length === 0) {
        const site = await client.query(
          "INSERT INTO sites (name, slug, address, email) VALUES ('Default Site', 'default', 'System Setup', $1) RETURNING id",
          [email]
        );
        siteId = site.rows[0].id;
      } else {
        siteId = siteResult.rows[0].id;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await client.query(
        `INSERT INTO users (site_id, name, email, password, role) 
         VALUES ($1, $2, $3, $4, 'admin') 
         RETURNING id, name, email, role`,
        [siteId, name, email, hashedPassword]
      );

      await client.query('COMMIT');

      res.json({ 
        message: 'System initialized successfully',
        user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role }
      });

    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } catch (err) {
    console.error('[Setup] Error:', err.message);
    if (err.message.includes('already exists') || err.code === '23505') {
      return res.status(400).json({ error: 'Email already registered. Please use the login page.' });
    }
    res.status(500).json({ error: 'Setup failed: ' + err.message });
  }
};
