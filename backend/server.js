const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Menu Routes handles the new varied prices explicitly
app.get('/api/menu', (req, res) => {
    db.all('SELECT * FROM menu', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/api/menu', (req, res) => {
    const { name, category, price_90, price_180, price_half, price_full, price_5lt, price_7lt } = req.body;
    db.run(`INSERT INTO menu (name, category, price_90, price_180, price_half, price_full, price_5lt, price_7lt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
    [name, category || 'Drinks', price_90 || 0, price_180 || 0, price_half || 0, price_full || 0, price_5lt || 0, price_7lt || 0], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name: name, category: 'Drinks', price_90, price_180, price_half, price_full, price_5lt, price_7lt });
    });
});

app.put('/api/menu/:id', (req, res) => {
    const id = req.params.id;
    const { name, category, price_90, price_180, price_half, price_full, price_5lt, price_7lt } = req.body;
    db.run(`UPDATE menu SET name = ?, category = ?, price_90 = ?, price_180 = ?, price_half = ?, price_full = ?, price_5lt = ?, price_7lt = ? WHERE id = ?`, 
    [name, category || 'Drinks', price_90 || 0, price_180 || 0, price_half || 0, price_full || 0, price_5lt || 0, price_7lt || 0, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: parseInt(id), name: name, category: 'Drinks', price_90, price_180, price_half, price_full, price_5lt, price_7lt });
    });
});

app.delete('/api/menu/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM menu WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ deleted: this.changes > 0 });
    });
});

app.get('/api/inventory', (req, res) => {
    db.all('SELECT * FROM inventory', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/inventory', (req, res) => {
    const { name } = req.body;
    db.run(`INSERT INTO inventory (name, stock_half, stock_full) VALUES (?, 0, 0)`, 
    [name], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name, stock_half: 0, stock_full: 0 });
    });
});

app.put('/api/inventory/:id/stock', (req, res) => {
    const id = req.params.id;
    const { stock_half, stock_full } = req.body;
    db.run(`UPDATE inventory SET stock_half = ?, stock_full = ? WHERE id = ?`, 
    [stock_half, stock_full, id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/inventory/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM inventory WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes > 0 });
    });
});

app.post('/api/sales', (req, res) => {
    const { total_amount, items_json } = req.body;
    db.run(`INSERT INTO sales (total_amount, items_json) VALUES (?, ?)`, 
    [total_amount, JSON.stringify(items_json)], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, success: true });
    });
});

app.get('/api/sales', (req, res) => {
    db.all(`SELECT * FROM sales ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/sales', (req, res) => {
    db.run(`DELETE FROM sales`, [], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes > 0, success: true });
    });
});

app.delete('/api/sales/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM sales WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes > 0, success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
