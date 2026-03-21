import db from '../config/db.js';

class CategoryRepository {
  async findAll(siteId, type = null) {
    let query = 'SELECT * FROM categories WHERE site_id = $1';
    const params = [siteId];
    
    if (type) {
      query += ' AND type = $2';
      params.push(type);
    }
    
    query += ' ORDER BY name ASC';
    const result = await db.query(query, params);
    return result.rows;
  }

  async findById(id, siteId) {
    const result = await db.query(
      'SELECT * FROM categories WHERE id = $1 AND site_id = $2',
      [id, siteId]
    );
    return result.rows[0];
  }

  async findByName(name, type, siteId) {
    const result = await db.query(
      'SELECT * FROM categories WHERE name = $1 AND type = $2 AND site_id = $3',
      [name, type, siteId]
    );
    return result.rows[0];
  }

  async create(categoryData, siteId) {
    const { name, type, description } = categoryData;
    const result = await db.query(
      `INSERT INTO categories (site_id, name, type, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [siteId, name, type, description || null]
    );
    return result.rows[0];
  }

  async update(id, categoryData, siteId) {
    const { name, description, is_active } = categoryData;
    const result = await db.query(
      `UPDATE categories 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           is_active = COALESCE($3, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4 AND site_id = $5
       RETURNING *`,
      [name, description, is_active, id, siteId]
    );
    return result.rows[0];
  }

  async delete(id, siteId) {
    const result = await db.query(
      'DELETE FROM categories WHERE id = $1 AND site_id = $2 RETURNING *',
      [id, siteId]
    );
    return result.rows[0];
  }

  async getStats(siteId) {
    const result = await db.query(
      `SELECT type, COUNT(*) as count 
       FROM categories 
       WHERE site_id = $1 
       GROUP BY type`,
      [siteId]
    );
    return result.rows;
  }
}

export default new CategoryRepository();
