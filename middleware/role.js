module.exports = (requiredRole) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: 'Forbidden: requires ' + requiredRole });
  }
  next();
};
// This middleware checks if the user has the required role.
// If not, it returns a 403 Forbidden response.