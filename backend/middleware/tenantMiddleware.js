const tenantMiddleware = (req, res, next) => {
  if (!req.user || !req.user.tenant) {
    // Superadmins might not have a tenant, handle accordingly
    if (req.user && req.user.role === 'superadmin') {
      return next();
    }
    return res.status(403).json({ message: 'No organization (tenant) associated with this user' });
  }

  req.tenantId = req.user.tenant;
  next();
};

module.exports = tenantMiddleware;
