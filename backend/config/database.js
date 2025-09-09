const sql = require('mssql');
require('dotenv').config();

const config = {
    server: process.env.DB_SERVER || 'localhost',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'FuelDelivery',
    port: parseInt(process.env.DB_PORT) || 1433,
    options: {
        encrypt: false, // Use this if you're on Windows Azure
        trustServerCertificate: true // Change to true for local dev / self-signed certs
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool = null;

const connectToDatabase = async () => {
    try {
        if (pool) {
            return pool;
        }
        
        pool = await sql.connect(config);
        console.log('MSSQL 데이터베이스 연결 성공');
        return pool;
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
        throw error;
    }
};

const getPool = () => {
    return pool;
};

module.exports = {
    connectToDatabase,
    getPool,
    sql
};