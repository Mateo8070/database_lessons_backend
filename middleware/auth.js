const jwt = require('jsonwebtoken');

// This middleware function runs BEFORE a protected route handler.
// It checks the Authorization header for a valid JWT token.
// If valid, it attaches the decoded user data to req.user and calls next().
// If not, it stops the request with a 401 or 403 error.
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ status: "error", message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ status: "error", message: "Invalid or expired token" });
    }

    // Attach the decoded payload to req.user so route handlers can access it
    req.user = user;
    next(); // Hand control over to the actual route handler
  });
};

module.exports = authenticateToken;
