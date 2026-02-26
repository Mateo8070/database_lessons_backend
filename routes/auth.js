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

// POST /register
// Public route — anyone can create an account (name, email, password)
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check if email is already taken
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ status: "error", message: "Email already in use" });
    }

    // 2. Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert the new user
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    res.status(201).json({ status: "success", user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
