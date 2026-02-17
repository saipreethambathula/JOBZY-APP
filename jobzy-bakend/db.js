const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file path
const dbPath = path.resolve(__dirname, "jobzy.db");

// Create / connect database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("SQLite connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

/* ===================== CREATE TABLES ===================== */
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      company_name TEXT NOT NULL,
      job_role TEXT NOT NULL,
      icon TEXT,
      description TEXT NOT NULL,
      long_description TEXT,
      skills TEXT,
      package TEXT,
      applyLink TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

module.exports = db;
