const express = require('express');
const {Pool} = require('pg')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
dotenv.config();
app.use(express.json());

const pool = new Pool({
host: process.env.HOST,
database: process.env.DB_NAME,
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
port: process.env.DB_PORT
});

//
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ status: "error", message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ status: "error", message: "Invalid or expired token" });
    }
    
    // Attach the user data to the request object so routes can use it
    req.user = user;
    next(); // Pass control to the next function (the route handler)
  });
};



//LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user) {
    return res.status(401).json({ status: "error", message: "Invalid email or password" });
  }

  // 2. Compare the submitted password with the stored hash
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ status: "error", message: "Invalid email or password" });
  }

  // 3. Credentials are valid: sign and return a JWT
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ status: "success", token: token });
});

// Now added 'authenticateToken' as a second argument to protect the route
app.get("/users", authenticateToken, async (req, res)=>{
  console.log("User requesting data:", req.user.email);
  try{
    const result = await pool.query("SELECT * FROM users");
    res.send({status: "success", data: result.rows});
  }catch(err){
    res.status(500).send({status: "error", message: err.message});
  }
});


app.get("/users/:id", authenticateToken, async (req, res)=>{
  try{
    const {id} = req.params;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    res.send({status: "success", data: result.rows});
  }catch(err){
    res.status(500).send({status: "error", message: err.message});
  }
});

app.post("/users", authenticateToken, async (req, res)=>{
    const {name, email, age, password } = req.body;
    try{
      // Hash the password before storing it — never store plaintext!
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users (name, email, age, password) VALUES ($1, $2, $3, $4)",
        [name, email, age, hashedPassword]
      );
      res.json({"status": "success", "message": "user created successfully"});
    }catch(err){
      res.json({"status": "error", "message": err.message})
    }
});


app.get("/orders", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id as order_id,
        u.name as user_name,
        p.name as product_name,
        c.name as category_name,
        o.amount
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN products p ON p.id = o.product_id
      JOIN categories c ON c.id = p.category_id
    `);
    res.json({ status: "success", data: result.rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});


app.listen(port = process.env.PORT || 3000, () => {
  console.log(`Server running on port ${port}`);
});


