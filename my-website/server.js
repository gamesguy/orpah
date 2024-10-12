const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
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
app.get('/comments/prologue', async (req, res) => {
    // Logic to fetch comments for the prologue
});

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
