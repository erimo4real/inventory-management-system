import AuthService from '../services/AuthService.js';
import pool from '../config/db.js';

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
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const decoded = AuthService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  
  // Get site_id from header, query, or JWT payload
  const siteId = req.headers['x-site-id'] || req.query.site_id || decoded.site_id;
  if (siteId) {
    req.siteId = parseInt(siteId, 10);
  }
  
  next();
};

// Require site context for operations
export const requireSite = async (req, res, next) => {
  if (!req.siteId) {
    return res.status(400).json({ error: 'Site ID is required. Include x-site-id header or site_id query parameter.' });
  }

  if (req.user) {
    try {
      const result = await pool.query(
        'SELECT 1 FROM user_sites WHERE user_id = $1 AND site_id = $2 AND is_active = true',
        [req.user.id, req.siteId]
      );
      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Access denied to this site' });
      }
    } catch (err) {
      return next(err);
    }
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


