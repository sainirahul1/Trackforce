const jwt = require('jsonwebtoken');
const User = require('../models/tenant/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.log("Protect MW: User not found for decoded token:", decoded.id);
        return res.status(401).json({ message: 'Not authorized, user not found' });
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
