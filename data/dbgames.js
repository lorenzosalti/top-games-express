const mysql = require('mysql2');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const connection = mysql.createConnection({
    host: DB_HOST || 'localhost',
    user: DB_USER || 'root',
    password: DB_PASSWORD,
    database: DB_NAME
});

connection.connect(err => {
    if (err) throw err;
    console.log('Server connected');
})

module.exports = connection;