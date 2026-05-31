export const validateProduct = (req, res, next) => {
  const { name, sku, category, quantity, price, description, barcode } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.length > 200) {
    errors.push('Name must be 200 characters or less');
  }

  if (!sku || typeof sku !== 'string' || sku.trim() === '') {
    errors.push('SKU is required');
  } else if (sku.length > 100) {
    errors.push('SKU must be 100 characters or less');
  }

  if (category && typeof category === 'string' && category.length > 100) {
    errors.push('Category must be 100 characters or less');
  }

  if (description && typeof description === 'string' && description.length > 2000) {
    errors.push('Description must be 2000 characters or less');
  }

  if (barcode && typeof barcode === 'string' && barcode.length > 100) {
    errors.push('Barcode must be 100 characters or less');
  }

  if (quantity !== undefined && quantity < 0) {
    errors.push('Quantity cannot be negative');
  }

  if (price !== undefined && price < 0) {
    errors.push('Price cannot be negative');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateSupplier = (req, res, next) => {
  const { name, contact_person, email, phone, address } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.length > 200) {
    errors.push('Name must be 200 characters or less');
  }

  if (contact_person && typeof contact_person === 'string' && contact_person.length > 200) {
    errors.push('Contact person must be 200 characters or less');
  }

  if (email && typeof email === 'string') {
    if (email.length > 255) {
      errors.push('Email must be 255 characters or less');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (phone && typeof phone === 'string' && phone.length > 50) {
    errors.push('Phone must be 50 characters or less');
  }

  if (address && typeof address === 'string' && address.length > 1000) {
    errors.push('Address must be 1000 characters or less');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateInventory = (req, res, next) => {
  const { product_id, quantity } = req.body;
  const errors = [];

  if (!product_id) {
    errors.push('Product ID is required');
  } else if (isNaN(parseInt(product_id))) {
    errors.push('Product ID must be a number');
  }

  if (quantity === undefined || quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateEntityInput = (req, res, next) => {
  const { name, email, phone, address, contact_person, company_name, city, country, notes, tax_id } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.length > 200) {
    errors.push('Name must be 200 characters or less');
  }

  if (company_name && typeof company_name === 'string' && company_name.length > 200) {
    errors.push('Company name must be 200 characters or less');
  }

  if (contact_person && typeof contact_person === 'string' && contact_person.length > 200) {
    errors.push('Contact person must be 200 characters or less');
  }

  if (email && typeof email === 'string') {
    if (email.length > 255) {
      errors.push('Email must be 255 characters or less');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (phone && typeof phone === 'string' && phone.length > 50) {
    errors.push('Phone must be 50 characters or less');
  }

  if (address && typeof address === 'string' && address.length > 1000) {
    errors.push('Address must be 1000 characters or less');
  }

  if (city && typeof city === 'string' && city.length > 100) {
    errors.push('City must be 100 characters or less');
  }

  if (country && typeof country === 'string' && country.length > 100) {
    errors.push('Country must be 100 characters or less');
  }

  if (notes && typeof notes === 'string' && notes.length > 2000) {
    errors.push('Notes must be 2000 characters or less');
  }

  if (tax_id && typeof tax_id === 'string' && tax_id.length > 100) {
    errors.push('Tax ID must be 100 characters or less');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateSiteUser = (req, res, next) => {
  const { user_id, site_id, role } = req.body;
  const errors = [];

  if (!user_id) {
    errors.push('User ID is required');
  } else if (isNaN(parseInt(user_id))) {
    errors.push('User ID must be a number');
  }

  if (!site_id) {
    errors.push('Site ID is required');
  } else if (isNaN(parseInt(site_id))) {
    errors.push('Site ID must be a number');
  }

  if (role && !['admin', 'manager', 'staff'].includes(role)) {
    errors.push('Role must be one of: admin, manager, staff');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateCategory = (req, res, next) => {
  const { name, type, description } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.length > 100) {
    errors.push('Name must be 100 characters or less');
  }

  if (type && !['product', 'vendor', 'supplier', 'client'].includes(type)) {
    errors.push('Type must be one of: product, vendor, supplier, client');
  }

  if (description && typeof description === 'string' && description.length > 1000) {
    errors.push('Description must be 1000 characters or less');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateSite = (req, res, next) => {
  const { name, slug, address, phone, email } = req.body;
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim() === '') {
    errors.push('Name is required');
  } else if (name.length > 255) {
    errors.push('Name must be 255 characters or less');
  }

  if (slug && typeof slug === 'string' && slug.length > 100) {
    errors.push('Slug must be 100 characters or less');
  }

  if (email && typeof email === 'string') {
    if (email.length > 255) {
      errors.push('Email must be 255 characters or less');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }
  }

  if (phone && typeof phone === 'string' && phone.length > 50) {
    errors.push('Phone must be 50 characters or less');
  }

  if (address && typeof address === 'string' && address.length > 1000) {
    errors.push('Address must be 1000 characters or less');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
