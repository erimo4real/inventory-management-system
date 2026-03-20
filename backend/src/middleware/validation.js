export const validateProduct = (req, res, next) => {
  const { name, sku, category, quantity, price } = req.body;
  const errors = [];

  if (!name || name.trim() === '') {
    errors.push('Name is required');
  }

  if (!sku || sku.trim() === '') {
    errors.push('SKU is required');
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
  const { name } = req.body;
  
  if (!name || name.trim() === '') {
    return res.status(400).json({ errors: ['Name is required'] });
  }
  
  next();
};

export const validateInventory = (req, res, next) => {
  const { product_id, quantity } = req.body;
  const errors = [];

  if (!product_id) {
    errors.push('Product ID is required');
  }

  if (quantity === undefined || quantity <= 0) {
    errors.push('Quantity must be greater than 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
