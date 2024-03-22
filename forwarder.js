const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const moment = require('moment')

function sendQuery( sqlQuery ) {
    connection.query(sqlQuery, [true], (error, results, fields) => {
        if (error) return console.error(error.message);
    });
}

function generateRandomComment() {
    return ( ( Math.random() + 1 ).toString(36).substring(7) );
}

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
        const queryType = req.body;

        if ( !queryType ) {
            return res.status(400).send({ error: `Missing required parameters ${queryType}` });
        }
        let sqlQuery;
        switch ( queryType )
        {
            case 'select': 
                sqlQuery = 'select * from testtable';
                sendQuery(sqlQuery);
                break;
            case 'insert': 
                for(let i = 0; i < 100000; i++) {  
                    sqlQuery = `insert into testtable (date, comment, number) values ('2024-01-01', '${ generateRandomComment() }', ${ ( Math.random() + i) })`;
                    sendQuery(sqlQuery);
                }
                break;
            case 'update': 
                for(let i = 0; i < 100000; i++) {
                    sqlQuery = `update testtable set comment='${ generateRandomComment() }' where id = ${ i+1 }`;
                    sendQuery(sqlQuery); 
                }
                break;
            case 'delete': 
                sqlQuery = `delete from testtable`;
                sendQuery(sqlQuery);
                break;
        }
        res.send(``);
    } catch (error) {
        console.error('Error forwarding SQL query:', error.message);
        res.status(500).send({ error: 'Internal server error' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
