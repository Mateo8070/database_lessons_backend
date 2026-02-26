const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// GET /users — get all users (protected)
router.get('/', authenticateToken, async (req, res) => {
  console.log("User requesting data:", req.user.email);
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// GET /users/:id — get a single user by ID (protected)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

// POST /users — create a new user with a hashed password (protected)
router.post('/', authenticateToken, async (req, res) => {
  const { name, email, age, password } = req.body;
  try {
    // Never store plaintext passwords — always hash first!
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, age, password) VALUES ($1, $2, $3, $4)",
      [name, email, age, hashedPassword]
    );
    res.json({ status: "success", message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
