const express = require('express');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// GET /orders — get all orders with user, product, and category details (protected)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id          AS order_id,
        u.name        AS user_name,
        p.name        AS product_name,
        c.name        AS category_name,
        o.amount
      FROM orders o
      JOIN users      u ON u.id = o.user_id
      JOIN products   p ON p.id = o.product_id
      JOIN categories c ON c.id = p.category_id
    `);
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

module.exports = router;
