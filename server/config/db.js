const db = require("mysql2/promise");
require("dotenv").config();
const dbPool = db.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});
module.exports = dbPool;
