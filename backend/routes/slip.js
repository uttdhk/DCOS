const express = require('express');
const { getPool, sql } = require('../config/database');
const { checkSession } = require('../middleware/auth');
const { mockSlips } = require('../data/mockData');
const router = express.Router();

// 출하실적 조회
router.get('/slip', checkSession, async (req, res) => {
    try {
        const { 
            plantCode, 
            loadingDate, 
            shipmentNo, 
            vehicleName, 
            driverName 
        } = req.query;

        // 데모 모드: 목업 데이터 필터링
        let filteredData = mockSlips.filter(item => {
            let matches = true;
            
            if (plantCode && item.PLANT_CODE !== plantCode) matches = false;
            if (loadingDate && item.LOADING_DATE !== loadingDate) matches = false;
            if (shipmentNo && item.SHIPMENT_NO !== shipmentNo) matches = false;
            if (vehicleName && !item.VEHICLE_NAME.includes(vehicleName)) matches = false;
            if (driverName && !item.DRIVER_NAME.includes(driverName)) matches = false;
            
            return matches;
        });
        
        res.json({
            success: true,
            data: filteredData
        });

    } catch (error) {
        console.error('출하실적 조회 에러:', error);
        res.status(500).json({
            success: false,
            message: '출하실적 조회 중 오류가 발생했습니다.'
        });
    }
});

// 출하실적 상세 조회
router.get('/slip/:shipmentNo', checkSession, async (req, res) => {
    try {
        const { shipmentNo } = req.params;
        
        // 데모 모드: 목업 데이터에서 상세 조회
        const slip = mockSlips.find(item => item.SHIPMENT_NO === shipmentNo);
        
        if (!slip) {
            return res.status(404).json({
                success: false,
                message: '해당 예고번호의 데이터를 찾을 수 없습니다.'
            });
        }

        res.json({
            success: true,
            data: slip
        });

    } catch (error) {
        console.error('출하실적 상세 조회 에러:', error);
        res.status(500).json({
            success: false,
            message: '출하실적 상세 조회 중 오류가 발생했습니다.'
        });
    }
});

module.exports = router;