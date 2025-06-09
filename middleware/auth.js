const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;   
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};
// This middleware checks for a JWT in the Authorization header,
// verifies it, and attaches the user information to the request object.