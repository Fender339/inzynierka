const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to forward SQL queries
app.post('/forward-sql', async (req, res) => {
    try {
        const { sqlQuery, dbEndpoint='localhost:3306' } = req.body;

        if (!sqlQuery || !dbEndpoint) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Forward the SQL query to the specified DB endpoint
        const response = await axios.post(dbEndpoint, { sqlQuery });

        // Return the response from the DB endpoint
        res.json(response.data);
    } catch (error) {
        console.error('Error forwarding SQL query:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
