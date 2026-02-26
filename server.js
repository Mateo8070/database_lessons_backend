const express = require('express');
const dotenv = require('dotenv');

// Route files — each one handles a specific resource
const authRoutes  = require('./routes/auth');
const userRoutes  = require('./routes/users');
const orderRoutes = require('./routes/orders');

dotenv.config();

const app = express();
app.use(express.json()); // Parse incoming JSON request bodies

// API ROUTER 
// All our routes live under /api/v1. Bumping to v2 later = one line change here.
// Note: authRoutes uses named paths (/login, /register) not a wildcard prefix

const apiRouter = express.Router();
apiRouter.use('/auth',   authRoutes);   // POST /api/v1/auth/login, POST /api/v1/auth/register
apiRouter.use('/users',  userRoutes);   // GET  /api/v1/users
apiRouter.use('/orders', orderRoutes);  // GET  /api/v1/orders


// Catch anything that didn't match inside /api/v1 — must be LAST inside apiRouter
apiRouter.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.originalUrl} — route not found`,
  });
});

app.use('/api/v1', apiRouter);

// Catch anything outside /api/v1 entirely (e.g. GET /, GET /random)
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.originalUrl} — route not found`,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
