const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', itemRoutes);

// Fetch random quote
app.get('/api/quote', (req, res) => {
    const { getRandomQuote } = require('./controllers/itemController');
    getRandomQuote(req, res);
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
