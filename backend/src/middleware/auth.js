import AuthService from '../services/AuthService.js';

/**
 * Auth Middleware - handles JWT verification
 */

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff'
};

/**
 * Permission matrix - defines what each role can do
 */
export const PERMISSIONS = {
  products: {
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'staff'],
    update: ['admin', 'manager'],
    delete: ['admin']
  },
  inventory: {
    stockIn: ['admin', 'manager', 'staff'],
    stockOut: ['admin', 'manager', 'staff'],
    adjust: ['admin', 'manager'],
    history: ['admin', 'manager', 'staff']
  },
  suppliers: {
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'staff'],
    update: ['admin', 'manager'],
    delete: ['admin']
  },
  clients: {
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'staff'],
    update: ['admin', 'manager'],
    delete: ['admin']
  },
  vendors: {
    create: ['admin', 'manager'],
    read: ['admin', 'manager', 'staff'],
    update: ['admin', 'manager'],
    delete: ['admin']
  },
  sites: {
    create: ['admin'],
    read: ['admin', 'manager', 'staff'],
    update: ['admin'],
    delete: ['admin']
  },
  users: {
    create: ['admin'],
    read: ['admin', 'manager'],
    update: ['admin'],
    delete: ['admin']
  },
  reports: {
    view: ['admin', 'manager', 'staff']
  }
};

// Verify JWT token and attach user to request
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = AuthService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  
  // Get site_id from header or query
  const siteId = req.headers['x-site-id'] || req.query.site_id;
  if (siteId) {
    req.siteId = parseInt(siteId, 10);
  }
  
  next();
};

// Require site context for operations
export const requireSite = (req, res, next) => {
  if (!req.siteId) {
    return res.status(400).json({ error: 'Site ID is required. Include x-site-id header or site_id query parameter.' });
  }
  next();
};

// Check if user has required role
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Check specific permission
export const checkPermission = (resource, action) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    const allowedRoles = PERMISSIONS[resource]?.[action] || [];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    
    next();
  };
};
