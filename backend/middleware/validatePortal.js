/**
 * Portal Isolation Middleware (CRITICAL SECURITY LAYER)
 * 
 * Validates that the JWT's `portal` claim matches the expected portal
 * for the route group. This prevents cross-portal API access even if
 * a user has a valid JWT token.
 * 
 * Usage:
 *   router.use(validatePortal('employee'))   // Only tokens issued for employee portal
 *   router.use(validatePortal('manager'))    // Only tokens issued for manager portal
 * 
 * SuperAdmin Override:
 *   SuperAdmins can access all portal APIs for impersonation/debugging.
 *   This is checked via the `role` claim, not the `portal` claim.
 */

const validatePortal = (...allowedPortals) => {
  return (req, res, next) => {
    // Guard: ensure auth middleware has run
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        code: 'AUTH_REQUIRED' 
      });
    }

    // SuperAdmin bypass: SuperAdmins can access any portal API for impersonation
    if (req.user.role === 'superadmin') {
      return next();
    }

    const tokenPortal = req.user.portal;

    // Legacy token fallback: if no portal claim exists, derive from role
    // This ensures backward compatibility during token migration
    const effectivePortal = tokenPortal || req.user.role;

    if (!effectivePortal) {
      console.error(`[PORTAL GUARD] No portal context for user ${req.user.id}. Denying access.`);
      return res.status(403).json({ 
        message: 'Access denied. No portal context found in your session.',
        code: 'PORTAL_MISSING' 
      });
    }

    // Normalize to lowercase for comparison
    const normalizedPortal = effectivePortal.toLowerCase();
    const normalizedAllowed = allowedPortals.map(p => p.toLowerCase());

    if (!normalizedAllowed.includes(normalizedPortal)) {
      console.warn(
        `[SECURITY] Portal violation: User '${req.user.email || req.user.id}' ` +
        `(portal: ${normalizedPortal}) tried to access [${normalizedAllowed.join(', ')}] APIs.`
      );
      return res.status(403).json({ 
        message: 'Access denied. You are not authorized to access this portal.',
        code: 'PORTAL_MISMATCH' 
      });
    }

    next();
  };
};

module.exports = validatePortal;
