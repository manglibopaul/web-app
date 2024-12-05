const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const axios = require('axios');

// Initialize the 'items' table if it doesn't exist
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
});

// GET all items
exports.getAllItems = (req, res) => {
    db.all('SELECT * FROM items', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

// POST a new item
exports.createItem = (req, res) => {
    const { name, description } = req.body;
    db.run('INSERT INTO items (name, description) VALUES (?, ?)', [name, description], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, description });
    });
};

// PUT update an item
exports.updateItem = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    db.run('UPDATE items SET name = ?, description = ? WHERE id = ?', [name, description, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id, name, description });
    });
};

// PATCH partially update an item
exports.partialUpdateItem = (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    db.run('UPDATE items SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?', 
    [name, description, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id, name, description });
    });
};

// DELETE an item
exports.deleteItem = (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM items WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Item with id ${id} deleted` });
    });
};

// GET a random quote
exports.getRandomQuote = async (req, res) => {
    const url = 'https://quotes15.p.rapidapi.com/quotes/random/?language_code=en';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '517269cfa6msh5f8a30ea31e7a96p1af6acjsnc0d803256b8e',
            'x-rapidapi-host': 'quotes15.p.rapidapi.com',
        },
    };

    try {
        const response = await axios(url, options);
        // Log the response to check its structure
        console.log(response.data);  // Log the response to see what data you're getting
        res.json(response.data);  // Send the quote back to the frontend
    } catch (error) {
        console.error('Error fetching quote:', error);  // Log any errors
        res.status(500).json({ error: 'Error fetching random quote' });
    }
};