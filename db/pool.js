const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// This Pool is the database connection manager.
// It keeps a set of open connections ready to use so we don't
// open and close a new connection on every request (that'd be slow).

const pool = new Pool({
  host: process.env.HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

module.exports = pool;
