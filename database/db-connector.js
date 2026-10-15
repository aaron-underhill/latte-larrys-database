/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// The basis of the database connection architecture was originally adapted
// from the course's nodejs-start-app repository.
//
// The project now uses PostgreSQL through the node-postgres ("pg") package
// and connects to a Neon-hosted PostgreSQL database.
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const { Pool } = require('pg');


// Create a PostgreSQL connection pool.
//
// DATABASE_URL contains the PostgreSQL username, password,
// hostname, database, and connection options.
//
// For deployment, we use Neon's pooled connection string.
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // Unreal Coffee is a small portfolio application,
    // so each Node instance only needs a small local pool.
    max: 3,

    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000
});


module.exports.pool = pool;