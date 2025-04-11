const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

// Create a new sales entry
app.post('/sales', async (req, res) => {
    const { supplier_details, buyer_details, delivery_location, place_of_supply, primary_document_details, items, email_recipients, total_before_tax, total_tax, total_after_tax } = req.body;
    
    try {
        const result = await pool.query(
            `INSERT INTO sales (supplier_details, buyer_details, delivery_location, place_of_supply, primary_document_details, items, email_recipients, total_before_tax, total_tax, total_after_tax)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [supplier_details, buyer_details, delivery_location, place_of_supply, primary_document_details, items, email_recipients, total_before_tax, total_tax, total_after_tax]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating sales:', error);
        res.status(500).json({ error: 'Error creating sales' });
    }
});

// Get all sales entries
app.get('/sales', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sales ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        console.error('Error retrieving sales:', error);
        res.status(500).json({ error: 'Error retrieving sales' });
    }
});

// Get a single sales entry by ID
app.get('/sales/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query('SELECT * FROM sales WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sales entry not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error retrieving sales:', error);
        res.status(500).json({ error: 'Error retrieving sales' });
    }
});

// Update a sales entry by ID
app.put('/sales/:id', async (req, res) => {
    const { id } = req.params;
    const { supplier_details, buyer_details, delivery_location, place_of_supply, primary_document_details, items, email_recipients, total_before_tax, total_tax, total_after_tax } = req.body;
    
    try {
        const result = await pool.query(
            `UPDATE sales SET supplier_details = $1, buyer_details = $2, delivery_location = $3, place_of_supply = $4, primary_document_details = $5, items = $6, email_recipients = $7, total_before_tax = $8, total_tax = $9, total_after_tax = $10
            WHERE id = $11 RETURNING *`,
            [supplier_details, buyer_details, delivery_location, place_of_supply, primary_document_details, items, email_recipients, total_before_tax, total_tax, total_after_tax, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sales entry not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating sales:', error);
        res.status(500).json({ error: 'Error updating sales' });
    }
});

// Delete a sales entry by ID
app.delete('/sales/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query('DELETE FROM sales WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Sales entry not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting sales:', error);
        res.status(500).json({ error: 'Error deleting sales' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
