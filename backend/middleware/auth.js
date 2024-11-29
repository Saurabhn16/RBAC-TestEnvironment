const jwt = require('jsonwebtoken');

// Middleware to authenticate the JWT token
const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });  // If token is not provided
  }

  // Verify the token using JWT secret
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // if (err) {
    //   return res.status(403).json({ message: 'Forbidden' });  // If token is invalid
    // }
    req.user = user;  // Attach user info to the request object
    next();  // Call the next middleware or route handler
  });
};

module.exports = { authenticateToken };
