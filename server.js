const express = require('express');
const dotenv = require('dotenv');

// Route files — each one handles a specific resource
const authRoutes  = require('./routes/auth');
const userRoutes  = require('./routes/users');
const orderRoutes = require('./routes/orders');

dotenv.config();

const app = express();
app.use(express.json()); // Parse incoming JSON request bodies

// Mount routers — the prefix here combines with the paths inside each file
app.use('/',       authRoutes);   // POST /login
app.use('/users',  userRoutes);   // GET /users, GET /users/:id, POST /users
app.use('/orders', orderRoutes);  // GET /orders

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
