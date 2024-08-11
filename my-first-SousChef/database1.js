const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Devu.0027',
    database: 'mySousChefDB1',
    // Other configurations...
});

module.exports = pool;

