const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'shreelatha.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Initialize tables with new schema containing multiple sizes
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        price_90 REAL,
        price_180 REAL,
        price_half REAL,
        price_full REAL,
        price_5lt REAL,
        price_7lt REAL
    )`);
    
    // Auto-patch new sizes into existing sqlite
    db.run(`ALTER TABLE menu ADD COLUMN price_5lt REAL DEFAULT 0`, (err) => {});
    db.run(`ALTER TABLE menu ADD COLUMN price_7lt REAL DEFAULT 0`, (err) => {});
    
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        stock_half INTEGER DEFAULT 0,
        stock_full INTEGER DEFAULT 0
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        total_amount REAL NOT NULL,
        items_json TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;
