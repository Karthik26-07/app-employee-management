const config = require('../utils/env-helper')
const mysql = require('mysql2')

const { DATABASE } = config;


const con = mysql.createConnection(
    {
        host: DATABASE.host,
        user: DATABASE.user,
        password: DATABASE.password,
        database: DATABASE.name,
    }
);

con.connect(function (err) {
    if (err) throw err;
    console.warn("Database Connected!");
});

module.exports = con;