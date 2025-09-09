const express = require('express');
const { getPool, sql } = require('../config/database');
const { mockUsers } = require('../data/mockData');
const router = express.Router();

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { userId } = req.body;
        
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: '사용자ID를 입력해주세요.'
            });
        }

        const pool = getPool();
        const request = pool.request();
        
        // TB_USR 테이블에서 사용자 조회
        const result = await request
            .input('userId', sql.VarChar, userId)
            .query('SELECT USR_ID, USR_NAME FROM TB_USR WHERE USR_ID = @userId');
        
        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: '존재하지 않는 사용자ID입니다.'
            });
        }

        const user = result.recordset[0];
        
        // 세션에 사용자 정보 저장
        req.session.user = {
            userId: user.USR_ID,
            userName: user.USR_NAME
        };

        res.json({
            success: true,
            message: '로그인 성공',
            user: {
                userId: user.USR_ID,
                userName: user.USR_NAME
            }
        });

    } catch (error) {
        console.error('로그인 에러:', error);
        res.status(500).json({
            success: false,
            message: '로그인 처리 중 오류가 발생했습니다.'
        });
    }
});

// 로그아웃
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: '로그아웃 처리 중 오류가 발생했습니다.'
            });
        }
        
        res.json({
            success: true,
            message: '로그아웃 완료'
        });
    });
});

// 세션 확인
router.get('/session', (req, res) => {
    if (req.session && req.session.user) {
        res.json({
            success: true,
            user: req.session.user
        });
    } else {
        res.status(401).json({
            success: false,
            message: '세션이 없습니다.'
        });
    }
});

module.exports = router;