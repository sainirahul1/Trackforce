const employee = (req, res, next) => {
  // Check if the user exists and has the 'employee' role.
  // We can also allow 'manager', 'tenant', or 'superadmin' to access employee routes if needed,
  // but usually employee routes are strictly for employees or managers.
  if (req.user && (req.user.role === 'employee' || req.user.role === 'manager' || req.user.role === 'tenant')) {
    next();
  } else {
    console.log("Employee MW: User is not authorized. User role:", req.user ? req.user.role : 'undefined');
    res.status(403).json({ message: 'Not authorized as an employee' });
  }
};

module.exports = { employee };
