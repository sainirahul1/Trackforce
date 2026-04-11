/**
 * Unified Role-Based Access Control (RBAC) Middleware
 * 
 * Replaces the scattered role checks (employeeMiddleware, managerMiddleware, admin)
 * with a single, consistent middleware that accepts allowed roles.
 * 
 * Usage:
 *   router.use(validateRole('employee'))                    // Employee only
 *   router.use(validateRole('manager'))                     // Manager only
 *   router.use(validateRole('tenant'))                      // Tenant admin only
 *   router.use(validateRole('superadmin'))                   // SuperAdmin only
 *   router.use(validateRole('manager', 'superadmin'))        // Manager OR SuperAdmin
 */

const validateRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Guard: ensure auth middleware has run
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'AUTH_REQUIRED' 
      });
    }

    const userRole = req.user.role;

    if (!userRole) {
      console.error(`[RBAC] No role found for user ${req.user.id}. Denying access.`);
      return res.status(403).json({ 
        message: 'Access denied. No role assigned to your account.',
        code: 'ROLE_MISSING' 
      });
    }

    // Normalize for comparison
    const normalizedRole = userRole.toLowerCase();
    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

    // SuperAdmin always has access (implicit override)
    if (normalizedRole === 'superadmin') {
      return next();
    }

    if (!normalizedAllowed.includes(normalizedRole)) {
      console.warn(
        `[SECURITY] RBAC violation: User '${req.user.email || req.user.id}' ` +
        `(role: ${normalizedRole}) tried to access [${normalizedAllowed.join(', ')}]-only API.`
      );
      return res.status(403).json({ 
        message: `Access denied. This resource requires one of the following roles: ${normalizedAllowed.join(', ')}.`,
        code: 'ROLE_UNAUTHORIZED' 
      });
    }

    next();
  };
};

module.exports = validateRole;
