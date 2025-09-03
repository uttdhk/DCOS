const express = require('express');
const { getPool, sql } = require('../config/database');
const { checkSession } = require('../middleware/auth');
const { mockPlants } = require('../data/mockData');
const router = express.Router();

// 출하지 코드 조회 (CODE_ID = 'DPT')
router.get('/plants', checkSession, async (req, res) => {
    try {
        // 데모 모드: 목업 데이터 반환
        res.json({
            success: true,
            data: mockPlants
        });

    } catch (error) {
        console.error('출하지 코드 조회 에러:', error);
        res.status(500).json({
            success: false,
            message: '출하지 코드 조회 중 오류가 발생했습니다.'
        });
    }
});

// 모든 코드 조회
router.get('/codes/:codeId', checkSession, async (req, res) => {
    try {
        const { codeId } = req.params;
        
        const pool = getPool();
        const request = pool.request();
        
        const result = await request
            .input('codeId', sql.VarChar, codeId)
            .query(`
                SELECT 
                    CODE_ID,
                    CODE_NO,
                    CODE_NAME,
                    DESCRIPTION,
                    CODE_NAME_ENG
                FROM TB_CODE 
                WHERE CODE_ID = @codeId
                ORDER BY CODE_NO
            `);
        
        res.json({
            success: true,
            data: result.recordset
        });

    } catch (error) {
        console.error('코드 조회 에러:', error);
        res.status(500).json({
            success: false,
            message: '코드 조회 중 오류가 발생했습니다.'
        });
    }
});

module.exports = router;