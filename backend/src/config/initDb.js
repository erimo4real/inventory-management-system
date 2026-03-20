import pool from './db.js';

const initDb = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Sites table (for multi-tenancy)
    await client.query(`
      CREATE TABLE IF NOT EXISTS sites (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        email VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Users table with roles and site association
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(site_id, email)
      )
    `);

    // Suppliers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id SERIAL PRIMARY KEY,
        site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        contact_person VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100) NOT NULL,
        category VARCHAR(100),
        quantity INTEGER DEFAULT 0,
        price DECIMAL(10, 2) DEFAULT 0.00,
        supplier_id INTEGER REFERENCES suppliers(id),
        low_stock_threshold INTEGER DEFAULT 10,
        description TEXT,
        barcode VARCHAR(100),
        image_url VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(site_id, sku)
      )
    `);

    // Inventory transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inventory_transactions (
        id SERIAL PRIMARY KEY,
        site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        type VARCHAR(10) NOT NULL CHECK (type IN ('IN', 'OUT', 'ADJUST')),
        quantity INTEGER NOT NULL,
        previous_quantity INTEGER NOT NULL,
        new_quantity INTEGER NOT NULL,
        note TEXT,
        performed_by INTEGER REFERENCES users(id),
        reference_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Clients table
    await client.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        contact_person VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        notes TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Vendors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id SERIAL PRIMARY KEY,
        site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        contact_person VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        category VARCHAR(100),
        tax_id VARCHAR(100),
        notes TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User-Site assignment table (for users with access to multiple sites)
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_sites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
        role VARCHAR(20) DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, site_id)
      )
    `);

    // Categories table for products and vendors
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('product', 'vendor', 'supplier', 'client')),
        description TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(site_id, name, type)
      )
    `);

    // Indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sites_slug ON sites(slug)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_site ON users(site_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_site ON products(site_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_products_low_stock ON products(quantity, low_stock_threshold)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product ON inventory_transactions(product_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created ON inventory_transactions(created_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_inventory_transactions_user ON inventory_transactions(performed_by)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_inventory_transactions_site ON inventory_transactions(site_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_clients_site ON clients(site_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_vendors_site ON vendors(site_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_suppliers_site ON suppliers(site_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_user_sites_user ON user_sites(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_user_sites_site ON user_sites(site_id)`);

    // Audit logs table for check and balance
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW')),
        entity_type VARCHAR(50) NOT NULL,
        entity_id INTEGER,
        old_data JSONB,
        new_data JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_site ON audit_logs(site_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_categories_site ON categories(site_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_categories_type ON categories(type)`);

    await client.query('COMMIT');
    console.log('Database tables created successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err);
  } finally {
    client.release();
  }
};

initDb();
