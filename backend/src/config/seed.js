import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create a default site
    const siteResult = await client.query(`
      INSERT INTO sites (name, slug, address, phone, email, is_active)
      VALUES ('Main Warehouse', 'main-warehouse', '123 Industrial Ave, City', '555-0100', 'warehouse@example.com', true)
      ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `);
    const siteId = siteResult.rows[0].id;
    console.log('Created site:', siteId);

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const userResult = await client.query(`
      INSERT INTO users (site_id, name, email, password, role, is_active)
      VALUES ($1, 'Admin User', 'admin@example.com', $2, 'admin', true)
      ON CONFLICT (site_id, email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, [siteId, hashedPassword]);
    const adminUserId = userResult.rows[0].id;
    console.log('Created admin user:', adminUserId);

    // Link admin to site
    await client.query(`
      INSERT INTO user_sites (user_id, site_id, role, is_active)
      VALUES ($1, $2, 'admin', true)
      ON CONFLICT (user_id, site_id) DO UPDATE SET role = 'admin', is_active = true
    `, [adminUserId, siteId]);

    // Create manager user
    const managerResult = await client.query(`
      INSERT INTO users (site_id, name, email, password, role, is_active)
      VALUES ($1, 'Jane Manager', 'manager@example.com', $2, 'manager', true)
      ON CONFLICT (site_id, email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, [siteId, hashedPassword]);
    const managerUserId = managerResult.rows[0].id;
    console.log('Created manager user:', managerUserId);

    // Link manager to site
    await client.query(`
      INSERT INTO user_sites (user_id, site_id, role, is_active)
      VALUES ($1, $2, 'manager', true)
      ON CONFLICT (user_id, site_id) DO UPDATE SET role = 'manager', is_active = true
    `, [managerUserId, siteId]);

    // Create staff user
    const staffResult = await client.query(`
      INSERT INTO users (site_id, name, email, password, role, is_active)
      VALUES ($1, 'Bob Staff', 'staff@example.com', $2, 'staff', true)
      ON CONFLICT (site_id, email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `, [siteId, hashedPassword]);
    const staffUserId = staffResult.rows[0].id;
    console.log('Created staff user:', staffUserId);

    // Link staff to site
    await client.query(`
      INSERT INTO user_sites (user_id, site_id, role, is_active)
      VALUES ($1, $2, 'staff', true)
      ON CONFLICT (user_id, site_id) DO UPDATE SET role = 'staff', is_active = true
    `, [staffUserId, siteId]);

    // Create Categories
    const categories = [
      { name: 'Electronics', type: 'product', description: 'Electronic devices and components' },
      { name: 'Furniture', type: 'product', description: 'Office and home furniture' },
      { name: 'Office Supplies', type: 'product', description: 'General office supplies' },
      { name: 'Raw Materials', type: 'product', description: 'Manufacturing raw materials' },
      { name: 'Packaging', type: 'product', description: 'Packaging materials' },
      { name: 'IT Equipment', type: 'product', description: 'Computers, printers, etc.' },
      { name: 'Safety Equipment', type: 'product', description: 'Safety gear and equipment' },
      { name: 'Cleaning Supplies', type: 'product', description: 'Cleaning and janitorial supplies' },
      { name: 'Electronics', type: 'vendor', description: 'Electronic components and devices' },
      { name: 'Furniture', type: 'vendor', description: 'Furniture manufacturers' },
      { name: 'IT Services', type: 'vendor', description: 'IT and software vendors' },
      { name: 'Raw Materials', type: 'vendor', description: 'Raw material suppliers' },
      { name: 'Packaging', type: 'vendor', description: 'Packaging suppliers' },
      { name: 'Logistics', type: 'vendor', description: 'Shipping and logistics providers' },
      { name: 'Corporate', type: 'client', description: 'Corporate clients' },
      { name: 'Individual', type: 'client', description: 'Individual customers' },
      { name: 'Retail', type: 'client', description: 'Retail store customers' },
      { name: 'Wholesale', type: 'client', description: 'Wholesale buyers' },
    ];

    for (const cat of categories) {
      await client.query(`
        INSERT INTO categories (site_id, name, type, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (site_id, name, type) DO UPDATE SET description = EXCLUDED.description
      `, [siteId, cat.name, cat.type, cat.description]);
    }
    console.log('Created categories');

    // Create Suppliers
    const suppliers = [
      { name: 'TechSupply Co', contact_person: 'John Smith', email: 'john@techsupply.com', phone: '555-1001', address: '100 Tech Blvd' },
      { name: 'Office Depot Plus', contact_person: 'Sarah Johnson', email: 'sarah@officedepot.com', phone: '555-1002', address: '200 Office Lane' },
      { name: 'Global Materials Inc', contact_person: 'Mike Brown', email: 'mike@globalmaterials.com', phone: '555-1003', address: '300 Industrial Way' },
    ];

    for (const sup of suppliers) {
      await client.query(`
        INSERT INTO suppliers (site_id, name, contact_person, email, phone, address)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [siteId, sup.name, sup.contact_person, sup.email, sup.phone, sup.address]);
    }
    console.log('Created suppliers');

    // Create Vendors
    const vendors = [
      { name: 'Electronics World', company_name: 'Electronics World Ltd', contact_person: 'Alice Wong', email: 'alice@electronicsworld.com', phone: '555-2001', city: 'New York', country: 'USA', category: 'Electronics', tax_id: 'TAX-001' },
      { name: 'Furniture Masters', company_name: 'Furniture Masters Inc', contact_person: 'Bob Davis', email: 'bob@furnituremasters.com', phone: '555-2002', city: 'Los Angeles', country: 'USA', category: 'Furniture', tax_id: 'TAX-002' },
      { name: 'IT Solutions Pro', company_name: 'IT Solutions Pro LLC', contact_person: 'Carol White', email: 'carol@itsolutionspro.com', phone: '555-2003', city: 'San Francisco', country: 'USA', category: 'IT Services', tax_id: 'TAX-003' },
      { name: 'PackRight Solutions', company_name: 'PackRight Solutions Corp', contact_person: 'Dan Lee', email: 'dan@packright.com', phone: '555-2004', city: 'Chicago', country: 'USA', category: 'Packaging', tax_id: 'TAX-004' },
      { name: 'SwiftLogistics', company_name: 'Swift Logistics Inc', contact_person: 'Eva Martinez', email: 'eva@swiftlogistics.com', phone: '555-2005', city: 'Miami', country: 'USA', category: 'Logistics', tax_id: 'TAX-005' },
    ];

    for (const vendor of vendors) {
      await client.query(`
        INSERT INTO vendors (site_id, name, company_name, contact_person, email, phone, city, country, category, tax_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [siteId, vendor.name, vendor.company_name, vendor.contact_person, vendor.email, vendor.phone, vendor.city, vendor.country, vendor.category, vendor.tax_id]);
    }
    console.log('Created vendors');

    // Create Clients
    const clients = [
      { name: 'Acme Corporation', company_name: 'Acme Corp', contact_person: 'Frank Miller', email: 'frank@acme.com', phone: '555-3001', city: 'Seattle', country: 'USA' },
      { name: 'TechStart Inc', company_name: 'TechStart Inc', contact_person: 'Grace Lee', email: 'grace@techstart.com', phone: '555-3002', city: 'Austin', country: 'USA' },
      { name: 'Global Retail Chain', company_name: 'Global Retail Chain LLC', contact_person: 'Henry Wilson', email: 'henry@globalretail.com', phone: '555-3003', city: 'Denver', country: 'USA' },
      { name: 'SmallBiz Owner', contact_person: 'Ivy Chen', email: 'ivy@smallbiz.com', phone: '555-3004', city: 'Portland', country: 'USA' },
      { name: 'MegaCorp Industries', company_name: 'MegaCorp Industries', contact_person: 'Jack Taylor', email: 'jack@megacorp.com', phone: '555-3005', city: 'Boston', country: 'USA' },
    ];

    for (const clientData of clients) {
      await client.query(`
        INSERT INTO clients (site_id, name, company_name, contact_person, email, phone, city, country)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [siteId, clientData.name, clientData.company_name, clientData.contact_person, clientData.email, clientData.phone, clientData.city, clientData.country]);
    }
    console.log('Created clients');

    // Create Products
    const products = [
      { name: 'Laptop HP ProBook', sku: 'LAP-001', category: 'Electronics', quantity: 25, price: 899.99, low_stock_threshold: 5 },
      { name: 'Office Desk (Wooden)', sku: 'DESK-001', category: 'Furniture', quantity: 50, price: 299.99, low_stock_threshold: 10 },
      { name: 'Printer Canon MF644', sku: 'PRN-001', category: 'Electronics', quantity: 15, price: 249.99, low_stock_threshold: 3 },
      { name: 'Notebook A4 (Pack of 10)', sku: 'NOTE-001', category: 'Office Supplies', quantity: 200, price: 12.99, low_stock_threshold: 50 },
      { name: 'USB Cable Type-C', sku: 'USB-001', category: 'Electronics', quantity: 100, price: 9.99, low_stock_threshold: 20 },
      { name: 'Chair Ergonomic', sku: 'CHAIR-001', category: 'Furniture', quantity: 30, price: 199.99, low_stock_threshold: 5 },
      { name: 'Paper A4 (Box)', sku: 'PAPER-001', category: 'Office Supplies', quantity: 150, price: 45.99, low_stock_threshold: 30 },
      { name: 'Monitor 24 inch', sku: 'MON-001', category: 'Electronics', quantity: 20, price: 179.99, low_stock_threshold: 5 },
      { name: 'Keyboard Wireless', sku: 'KB-001', category: 'Electronics', quantity: 40, price: 49.99, low_stock_threshold: 10 },
      { name: 'Safety Goggles', sku: 'SAFETY-001', category: 'Safety Equipment', quantity: 100, price: 15.99, low_stock_threshold: 25 },
      { name: 'Cleaning Spray (1L)', sku: 'CLEAN-001', category: 'Cleaning Supplies', quantity: 80, price: 8.99, low_stock_threshold: 20 },
      { name: 'Cardboard Boxes (Pack)', sku: 'BOX-001', category: 'Packaging', quantity: 60, price: 24.99, low_stock_threshold: 15 },
    ];

    for (const prod of products) {
      await client.query(`
        INSERT INTO products (site_id, name, sku, category, quantity, price, low_stock_threshold)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (site_id, sku) DO UPDATE SET quantity = EXCLUDED.quantity
      `, [siteId, prod.name, prod.sku, prod.category, prod.quantity, prod.price, prod.low_stock_threshold]);
    }
    console.log('Created products');

    await client.query('COMMIT');
    console.log('\n✅ Seed completed successfully!');
    console.log('\n📧 Test Accounts:');
    console.log('   Admin:    admin@example.com / admin123');
    console.log('   Manager:  manager@example.com / admin123');
    console.log('   Staff:    staff@example.com / admin123');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed error:', err);
  } finally {
    client.release();
  }
};

seed();
