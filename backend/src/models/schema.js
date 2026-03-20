export const productSchema = {
  required: ['name', 'sku', 'category'],
  optional: ['quantity', 'price', 'supplier_id', 'low_stock_threshold', 'description', 'barcode'],
  types: {
    name: 'string',
    sku: 'string',
    category: 'string',
    quantity: 'number',
    price: 'number',
    supplier_id: 'number',
    low_stock_threshold: 'number',
    description: 'string',
    barcode: 'string'
  }
};

export const supplierSchema = {
  required: ['name'],
  optional: ['contact_person', 'email', 'phone', 'address'],
  types: {
    name: 'string',
    contact_person: 'string',
    email: 'string',
    phone: 'string',
    address: 'string'
  }
};

export const inventorySchema = {
  required: ['product_id', 'quantity'],
  optional: ['note', 'reference_id', 'performed_by'],
  types: {
    product_id: 'number',
    quantity: 'number',
    note: 'string',
    reference_id: 'string',
    performed_by: 'string'
  }
};
