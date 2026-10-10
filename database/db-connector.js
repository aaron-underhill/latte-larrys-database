/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// The basis of the following starter code was adapted from the course's nodejs-start-app repository, specifcally following step 1
// source : https://github.com/osu-cs340-ecampus/nodejs-starter-app
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require('dotenv').config();


// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// Export it for use in our application
module.exports.pool = pool;
