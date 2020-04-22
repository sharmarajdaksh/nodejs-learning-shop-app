const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'sharmarajdaksh',
    database: 'node-maxim',
    password: 'qwe123'
});

module.exports = pool.promise();

// ALTER USER 'sharmarajdaksh'@'localhost' IDENTIFIED BY 'qwe123';