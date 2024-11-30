const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Adjust path to your User model

const roleMiddleware = (role) => {
  return async (req, res, next) => {
    try {
      // Extract token from authorization header
      const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
      if (!token) {
        console.log("No token provided");
        return res.status(403).json({ message: 'No token provided' });
      }

      // Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decoded:", decoded);
      } catch (err) {
        console.log("JWT verification failed:", err);
        return res.status(403).json({ message: 'Invalid token' });
      }
      
      req.user = decoded; // Attach decoded user data to the request

      // Log the decoded user and the required role
      // console.log("Decoded user ID:", req.user.id);
      // console.log("Required role:", role);

      // Check if the user has the required role
      const user = await User.findById(req.user.id);
      if (!user) {
        // console.log("User not found");
        return res.status(404).json({ message: 'User not found' });
      }

      // console.log("User found:", user);
      if (user.role === role) {
        // console.log("User has the required role");
        return next(); // Proceed to the next middleware/route handler
      }

      // console.log("User does not have the required role");
      return res.status(403).json({ message: 'You do not have the required role' });
    } catch (error) {
      // console.error('Error in roleMiddleware:', error);
      return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  };
};

module.exports = roleMiddleware;
