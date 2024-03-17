const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const moment = require('moment')


const app = express();
const port = 3000;

app.use(cors()); //allow all origin
app.use(bodyParser.text());

let connection = mysql.createConnection({
    /*host: 'localhost',
    port: '3306',
    user: 'test_user',
    password: 'Zaq1@wsx',
    database: 'inzynierka'*/

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  connection.connect((err) => { if (err) return console.error(err.message); })

app.post('/', async (req, res) => {
    try {
        let start = moment().milliseconds()
        const sqlQuery = req.body;

        if ( !sqlQuery ) {
            return res.status(400).send({ error: `Missing required parameters ${sqlQuery}` });
        }
        connection.query(sqlQuery, [true], (error, results, fields) => {
            if (error) return console.error(error.message);
            res.send(`Time of execution: ${moment().milliseconds() - start}`);
        });
    } catch (error) {
        console.error('Error forwarding SQL query:', error.message);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
