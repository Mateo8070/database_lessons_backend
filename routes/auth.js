const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const router = express.Router();

// POST /login
// Verifies email + password and returns a signed JWT
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ status: "error", message: "Invalid email or password" });
  }

  // 2. Compare the submitted password with the stored bcrypt hash
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ status: "error", message: "Invalid email or password" });
  }

  // 3. Credentials are valid — sign and return a JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ status: "success", token: token });
});

module.exports = router;
