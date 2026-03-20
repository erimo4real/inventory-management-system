# Inventory Management System (IMS)

A full-stack inventory management application built with Vue.js/Node.js/PostgreSQL, designed for tracking products, managing stock levels, and monitoring inventory transactions.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue.js 3 + Vite + Vuex |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| File Storage | Cloudinary |
| Authentication | JWT |

## Features

- **Authentication** - Secure login/register with JWT tokens
- **Role-Based Access Control** - Admin, Manager, Staff roles
- **Product Management** - CRUD operations with SKU, category, price, quantity, images
- **Inventory Operations** - Stock IN, Stock OUT, Stock ADJUST
- **Supplier Management** - Track vendor information
- **Low Stock Alerts** - Products below threshold
- **Dashboard** - Overview stats and recent transactions
- **Transaction History** - Full audit trail of all stock changes
- **Image Upload** - Cloudinary integration for product images
- **User Management** - Admin can manage users

## User Roles & Permissions

| Feature | Admin | Manager | Staff |
|---------|-------|---------|-------|
| View Products | ✓ | ✓ | ✓ |
| Create Products | ✓ | ✓ | ✗ |
| Update Products | ✓ | ✓ | ✗ |
| Delete Products | ✓ | ✗ | ✗ |
| Stock In/Out | ✓ | ✓ | ✓ |
| Stock Adjust | ✓ | ✓ | ✗ |
| Manage Suppliers | ✓ | ✓ | ✗ |
| Manage Users | ✓ | View | ✗ |

## Project Structure

```
inventory-management-system/
├── backend/
│   └── src/
│       ├── config/          # Database & Cloudinary config
│       ├── controllers/     # HTTP request handlers
│       ├── repositories/    # Data access layer
│       ├── services/        # Business logic
│       ├── middleware/      # Auth, validation, errors
│       ├── models/          # Schema definitions
│       ├── utils/           # Helper functions
│       └── routes/          # API routes
├── frontend/
│   └── src/
│       ├── views/          # Page components
│       ├── services/        # API client
│       ├── store/           # Vuex state management
│       │   └── modules/     # Auth, Products, Inventory, etc.
│       ├── components/      # Reusable components
│       └── router/          # Navigation
└── README.md
```

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Cloudinary account (for image uploads)

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE inventory_db;
```

### 3. Configure Environment Variables

Copy the example env file and update values:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-key

# Cloudinary (get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:3000/api
```

### 4. Initialize Database

```bash
cd backend
npm run db:init
```

This creates tables:
- `users` - User accounts with roles
- `suppliers` - Vendor information
- `products` - Product inventory
- `inventory_transactions` - Stock change history

### 5. Run the Application

```bash
# Terminal 1 - Backend (port 3000)
cd backend
npm start

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/change-password` | Change password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin/Manager) |
| PUT | `/api/products/:id` | Update product (Admin/Manager) |
| DELETE | `/api/products/:id` | Delete product (Admin only) |
| GET | `/api/products/categories` | List categories |
| GET | `/api/products/low-stock` | List low stock products |

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inventory/in` | Add stock |
| POST | `/api/inventory/out` | Remove stock |
| POST | `/api/inventory/adjust/:product_id` | Set stock quantity |
| GET | `/api/inventory/history/:product_id` | Product history |
| GET | `/api/inventory/history` | Recent transactions |
| GET | `/api/inventory/stats` | Dashboard statistics |

### Suppliers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/suppliers` | List all suppliers |
| GET | `/api/suppliers/:id` | Get single supplier |
| POST | `/api/suppliers` | Create supplier (Admin/Manager) |
| PUT | `/api/suppliers/:id` | Update supplier (Admin/Manager) |
| DELETE | `/api/suppliers/:id` | Delete supplier (Admin only) |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get single user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/image` | Upload single image |
| POST | `/api/upload/images` | Upload multiple images |
| DELETE | `/api/upload/image` | Delete image |

## Vuex Store Modules

```javascript
// Accessing state
store.state.auth.user        // Current user
store.state.products.items   // Products list
store.state.dashboard.stats  // Dashboard statistics

// Using getters
store.getters['auth/isAuthenticated']
store.getters['auth/isAdmin']
store.getters['products/allProducts']
store.getters['dashboard/totalProducts']
store.getters['dashboard/lowStockCount']

// Dispatching actions
store.dispatch('auth/login', { email, password })
store.dispatch('products/fetchProducts')
store.dispatch('dashboard/fetchDashboardStats')
```

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

### Create Product
```bash
POST /api/products
{
  "name": "Wireless Mouse",
  "sku": "WM-001",
  "category": "Electronics",
  "quantity": 50,
  "price": 29.99,
  "low_stock_threshold": 10,
  "image_url": "https://cloudinary.com/..."
}
```

### Stock In
```bash
POST /api/inventory/in
{
  "product_id": 1,
  "quantity": 20,
  "note": "Restocking from supplier"
}
```

### Dashboard Stats Response
```json
{
  "total_products": 150,
  "total_stock": 5000,
  "low_stock_count": 5,
  "total_value": 75000.00,
  "recent_transactions": [...]
}
```

## Deployment

### Backend (Vercel)
```bash
cd backend
vercel deploy
```

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

## Development

### Running in Development Mode
```bash
# Backend with auto-reload
cd backend
npm run dev

# Frontend with hot reload
cd frontend
npm run dev
```

### Debug Logging
All layers include debug logs for troubleshooting:
```
[Controller createProduct] body: {...}
[ProductService createProduct] input: {...}
[ProductRepo create] data: {...}
```

## First Time Setup

1. Register first user - will be assigned Admin role
2. Login with admin credentials
3. Navigate to Profile to change password
4. Add products, suppliers
5. Manage inventory with stock in/out

## License

MIT
