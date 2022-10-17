require('dotenv').config({path: '.env'})

var mysql = require('mysql');

const db = mysql.createConnection({

    host: process.env.HOST,

    user: process.env.DB_USERNAME,

    password: process.env.DB_PWD,

    database: process.env.DATABASE,

    multipleStatements: true,

    max: 10,

    idleTimeoutMillis: 30000,

});



db.connect(function(err) {

    if (err) throw err;

//Kết nôi thành công

    console.log("Connected!");

});



module.exports = db;