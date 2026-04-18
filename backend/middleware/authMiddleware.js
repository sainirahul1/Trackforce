const jwt = require('jsonwebtoken');
const User = require('../models/tenant/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.query.token) {
    token = req.query.token;
  }

  if (token) {
    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // PERF: Fast-path for metadata-enriched tokens
      // Only use fast-path if ALL critical security claims are present
      if (decoded.id && decoded.role && decoded.tenant) {
        req.user = {
          id: decoded.id,
          _id: decoded.id,
          role: decoded.role,
          name: decoded.name || null,
          email: decoded.email || null,
          tenant: decoded.tenant,
          portal: decoded.portal || decoded.role // PORTAL ISOLATION fallback
        };
        return next();
      }

      // Fallback for legacy tokens or missing metadata (e.g. missing tenant/portal)
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Metadata enrichment for subsequent middleware
      req.user.id = req.user._id.toString();
      req.user.portal = decoded.portal || decoded.role || req.user.role;

      // Check for global logout invalidation only in the fallback path
      if (req.user.lastLogoutAt && decoded.iat * 1000 < new Date(req.user.lastLogoutAt).getTime()) {
        return res.status(401).json({ message: 'Session invalidated, please login again' });
      }

      return next();
    } catch (error) {
      console.error("Protect MW: Token verification failed:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    console.log("Protect MW: No token provided in authorization header", req.headers.authorization);
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    console.log("Admin MW: User is not superadmin. User:", req.user ? req.user.role : 'undefined');
    res.status(401).json({ message: 'Not authorized as a super admin' });
  }
};

module.exports = { protect, admin };
