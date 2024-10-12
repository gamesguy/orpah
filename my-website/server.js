const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://fxbgzppsdbhxktnygyby.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4Ymd6cHBzZGJoeGt0bnlneWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg3Njc3NDMsImV4cCI6MjA0NDM0Mzc0M30.WTqaS_oucgxJlDZtD25oeGxQp986MQYToRliiRaKcv0'; // Replace with your Supabase public API key
const supabase = createClient(supabaseUrl, supabaseKey);

const path = require('path');

const app = express();
app.use(bodyParser.json());

// Configure PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'commentsdb',
    password: 'rerejosh123@',
    port: 5432,
});

// Serve static files from the 'book web' directory
app.use(express.static(path.join(__dirname, '..')));

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Endpoint to post a comment for a specific chapter
app.post('/comments/:chapter', async (req, res) => {
    const { chapter } = req.params; // Get the chapter from the URL
    const { name, content } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO comments (chapter, name, content) VALUES ($1, $2, $3) RETURNING *',
            [chapter, name, content]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint to retrieve comments for a specific chapter
app.get('/comments/:chapter', async (req, res) => {
    const { chapter } = req.params; // Get the chapter from the URL
    try {
        const result = await pool.query('SELECT * FROM comments WHERE chapter = $1 ORDER BY date DESC', [chapter]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
