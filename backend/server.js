const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const { connectToDatabase } = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const slipRoutes = require('./routes/slip');
const codeRoutes = require('./routes/code');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'fuel_delivery_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // HTTPS 환경에서는 true로 설정
        httpOnly: true,
        maxAge: 30 * 60 * 1000 // 30분 (밀리초)
    }
}));

// Static files (Frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', slipRoutes);
app.use('/api', codeRoutes);

// Frontend routing - SPA를 위해 모든 요청을 index.html로 리다이렉트
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('서버 에러:', err);
    res.status(500).json({
        success: false,
        message: '서버 내부 오류가 발생했습니다.'
    });
});

// Start server
const startServer = async () => {
    try {
        // 데이터베이스 연결
        await connectToDatabase();
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
            console.log(`http://localhost:${PORT} 에서 접속 가능합니다.`);
        });
    } catch (error) {
        console.error('서버 시작 실패:', error);
        process.exit(1);
    }
};

startServer();