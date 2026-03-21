# Inventory Management System (IMS)

A full-stack inventory management application built with Vue.js/Node.js/PostgreSQL, designed for tracking products, managing stock levels, monitoring inventory transactions, and supporting multiple sites with complete audit logging.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Vue.js 3 + Vite + Vuex |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| File Storage | Cloudinary |
| Authentication | JWT |
| Deployment | Docker |

## Features

### Core Features
- **Multi-Site Support** - Manage multiple warehouses/locations with isolated data
- **Authentication** - Secure login/register with JWT tokens
- **Role-Based Access Control** - Admin, Manager, Staff roles
- **Product Management** - CRUD operations with SKU, category, price, quantity, images
- **Inventory Operations** - Stock IN, Stock OUT, Stock ADJUST
- **Supplier Management** - Track vendor/supplier information
- **Client Management** - Manage customer/client profiles with contact details
- **Vendor Management** - Track vendor relationships with categories
- **Low Stock Alerts** - Products below threshold
- **Dashboard** - Overview stats and recent transactions
- **Transaction History** - Full audit trail of all stock changes
- **Image Upload** - Cloudinary integration for product images
- **User Management** - Admin can manage users
- **Audit Logging** - Complete check & balance with user activity tracking
- **Categories Management** - Organize products, vendors, suppliers, clients by category
- **Reports & Records** - Daily summaries, inventory valuation, monthly trends

### Vuexy-Style UI
- Professional Vuexy-inspired design throughout the application
- Custom SVG icons (no emojis) for all features
- Consistent color scheme (purple primary #7367f0)
- Toast notifications for success/error feedback
- Loading spinners and empty states
- Responsive design for all screen sizes
- Breadcrumb navigation
- Professional stat cards with icons
- Badge system for status indicators

### Authentication Pages
- **Login Page** - Chart illustrations, demo credentials, remember me
- **Register Page** - Feature highlights, animated SVG illustrations
- **Forgot Password** - Security icons, recovery process visualization

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
| Manage Clients | ✓ | ✓ | ✗ |
| Manage Vendors | ✓ | ✓ | ✗ |
| Manage Users | ✓ | ✓ | ✗ |
| Manage Sites | ✓ | ✗ | ✗ |
| View Audit Logs | ✓ | ✓ | ✗ |

## Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/erimo4real/inventory-management-system.git
cd inventory-management-system

# Copy and configure environment
cp docker.env.example .env
# Edit .env with your settings

# Build and start containers
docker compose up -d

# Access the app
# Frontend: http://localhost
# Backend API: http://localhost:3000/api
```

## Manual Installation

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Cloudinary account (for image uploads)

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

### 4. Initialize Database

```bash
cd backend
npm run db:init
```

### 5. Run the Application

```bash
# Terminal 1 - Backend (port 3000)
cd backend
npm start

# Terminal 2 - Frontend (port 5173)
cd frontend
npm run dev
```

## Project Structure

```
inventory-management-system/
├── backend/
│   └── src/
│       ├── config/          # Database & Cloudinary config
│       ├── controllers/     # HTTP request handlers
│       ├── repositories/    # Data access layer
│       ├── services/       # Business logic
│       ├── middleware/      # Auth, validation, errors
│       ├── models/          # Schema definitions
│       ├── utils/           # Helper functions
│       └── routes/          # API routes
├── frontend/
│   └── src/
│       ├── features/        # Feature-based modules
│       │   ├── auth/       # Authentication views
│       │   ├── dashboard/  # Dashboard view
│       │   ├── products/   # Products CRUD
│       │   ├── inventory/  # Inventory management
│       │   ├── clients/    # Clients CRUD
│       │   ├── vendors/    # Vendors CRUD
│       │   ├── categories/ # Categories management
│       │   ├── users/     # User management
│       │   ├── reports/    # Reports & records
│       │   ├── sites/     # Site management
│       │   ├── audit/     # Audit logs
│       │   └── profile/   # User profile
│       └── shared/
│           ├── components/ # Shared components
│           ├── services/   # API client
│           ├── store/      # Vuex modules
│           ├── styles/     # Global styles
│           └── router/     # Navigation
├── docker-compose.yml
├── docker.env.example
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/change-password` | Change password |

### Sites (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sites` | List all sites |
| POST | `/api/sites` | Create site |
| PUT | `/api/sites/:id` | Update site |
| DELETE | `/api/sites/:id` | Delete site |
| GET | `/api/sites/my` | Get user's assigned sites |

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

### Clients
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clients` | List all clients |
| GET | `/api/clients/:id` | Get single client |
| GET | `/api/clients/stats` | Client statistics |
| POST | `/api/clients` | Create client (Admin/Manager) |
| PUT | `/api/clients/:id` | Update client (Admin/Manager) |
| DELETE | `/api/clients/:id` | Delete client (Admin only) |

### Vendors
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vendors` | List all vendors |
| GET | `/api/vendors/:id` | Get single vendor |
| GET | `/api/vendors/stats` | Vendor statistics |
| GET | `/api/vendors/categories` | Vendor categories |
| POST | `/api/vendors` | Create vendor (Admin/Manager) |
| PUT | `/api/vendors/:id` | Update vendor (Admin/Manager) |
| DELETE | `/api/vendors/:id` | Delete vendor (Admin only) |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

### Users (Admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/:id` | Get single user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/daily` | Daily summary report |
| GET | `/api/reports/inventory` | Inventory valuation |
| GET | `/api/reports/users` | User activity report |
| GET | `/api/reports/trends` | Monthly trends |

### Audit Logs (Admin/Manager)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/audit/logs` | Get audit logs |
| GET | `/api/audit/logs/stats` | Audit statistics |
| GET | `/api/audit/entity/:type/:id` | Entity history |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/image` | Upload single image |
| POST | `/api/upload/images` | Upload multiple images |
| DELETE | `/api/upload/image` | Delete image |

## Database Schema

### Tables Created
- `sites` - Multiple site/warehouse locations
- `users` - User accounts with roles
- `user_sites` - User-site assignments
- `suppliers` - Supplier/vendor information
- `products` - Product inventory
- `inventory_transactions` - Stock change history
- `clients` - Client/customer profiles
- `vendors` - Vendor relationships
- `categories` - Category types for all entities
- `audit_logs` - Complete activity logging

## First Time Setup

1. Start the application (Docker or manual)
2. Register first user - will be assigned Admin role
3. Login with admin credentials
4. Go to **Site Management** to create your first site
5. Add products, suppliers, clients, vendors
6. Manage inventory with stock in/out
7. Monitor activity in **Audit Logs**

### Demo Credentials
- Admin: `admin@example.com` / `admin123`
- Manager: `manager@example.com` / `admin123`
- Staff: `staff@example.com` / `admin123`

## Docker Deployment

### Environment Variables

Create a `.env` file:

```env
DB_USER=postgres
DB_PASSWORD=your_secure_password
JWT_SECRET=your-very-secure-jwt-secret-key-min-32-chars
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Docker Commands

```bash
# Build images
docker compose build

# Start containers
docker compose up -d

# View logs
docker compose logs -f

# Stop containers
docker compose down

# Rebuild and start
docker compose up --build -d
```

## License

MIT
