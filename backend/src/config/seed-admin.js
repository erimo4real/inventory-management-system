import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const seedAdmin = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const siteResult = await client.query(`
      INSERT INTO sites (name, slug, address, phone, email, is_active)
      VALUES ('Main Warehouse', 'main-warehouse', '123 Industrial Ave, City', '555-0100', 'warehouse@example.com', true)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `);
    const siteId = siteResult.rows[0].id;
    console.log('Created site:', siteId);

    const hashedPassword = await bcrypt.hash('admin123', 10);
    const userResult = await client.query(`
      INSERT INTO users (site_id, name, email, password, role, is_active)
      VALUES ($1, 'Admin User', 'admin@example.com', $2, 'admin', true)
      ON CONFLICT (site_id, email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, [siteId, hashedPassword]);
    const adminUserId = userResult.rows[0].id;
    console.log('Created admin user:', adminUserId);

    await client.query(`
      INSERT INTO user_sites (user_id, site_id, role, is_active)
      VALUES ($1, $2, 'admin', true)
      ON CONFLICT (user_id, site_id) DO UPDATE SET role = 'admin', is_active = true
    `, [adminUserId, siteId]);

    await client.query('COMMIT');
    console.log('\nAdmin seed completed!');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed error:', err);
  } finally {
    client.release();
  }
};

seedAdmin();
