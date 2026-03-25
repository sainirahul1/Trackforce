const manager = (req, res, next) => {
  if (req.user && (req.user.role === 'manager' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a manager' });
  }
};

module.exports = { manager };
