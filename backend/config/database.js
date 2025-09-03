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
        
        // 데모 모드: 실제 DB 연결 대신 목업 데이터 사용
        console.log('데모 모드: 목업 데이터베이스 연결 시뮬레이션');
        pool = { connected: true, demo: true };
        return pool;
    } catch (error) {
        console.error('데이터베이스 연결 실패:', error);
        // 데모 모드에서는 에러를 던지지 않고 목업 연결 반환
        pool = { connected: false, demo: true };
        return pool;
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