const express = require('express');
const { getPool, sql } = require('../config/database');
const { checkSession } = require('../middleware/auth');
const { mockOrders } = require('../data/mockData');
const router = express.Router();

// 출하예고 조회
router.get('/shipment', checkSession, async (req, res) => {
    try {
        const { 
            plantCode, 
            loadingDate, 
            shipmentNo, 
            vehicleName, 
            driverName,
            page = 1,
            limit = 20
        } = req.query;
        
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const offset = (pageNum - 1) * limitNum;

        const pool = getPool();
        let request = pool.request();
        
        let query = `
            SELECT 
                LOADING_DATE,
                SHIPMENT_NO,
                PLANT_CODE,
                PLANT_NAME,
                TRIP,
                SOLD_TO_CODE,
                SOLD_TO_NAME,
                SHIP_TO_CODE,
                SHIP_TO_NAME,
                CARRIER_CODE,
                CARRIER_NAME,
                VEHICLE_NO,
                VEHICLE_CARD_NO,
                VEHICLE_NANME as VEHICLE_NAME,
                DRIVER_CODE,
                DRIVER_NAME,
                ORDER_TYPE,
                MTRL_CODE,
                MTRL_NAME,
                GN_INDICATOR,
                ORDER_QTY,
                UOM,
                MIX_RATE,
                ARMY_CODE,
                ADDITIVE,
                E_SLIP,
                STATUS
            FROM TB_ORDER 
            WHERE DELETE_BIT = 'N'
        `;

        if (plantCode) {
            query += ' AND PLANT_CODE = @plantCode';
            request.input('plantCode', sql.VarChar, plantCode);
        }
        
        if (loadingDate) {
            query += ' AND LOADING_DATE = @loadingDate';
            request.input('loadingDate', sql.VarChar, loadingDate);
        }
        
        if (shipmentNo) {
            query += ' AND SHIPMENT_NO = @shipmentNo';
            request.input('shipmentNo', sql.VarChar, shipmentNo);
        }
        
        if (vehicleName) {
            query += ' AND VEHICLE_NANME LIKE @vehicleName';
            request.input('vehicleName', sql.VarChar, `%${vehicleName}%`);
        }
        
        if (driverName) {
            query += ' AND DRIVER_NAME LIKE @driverName';
            request.input('driverName', sql.VarChar, `%${driverName}%`);
        }

        query += ' ORDER BY LOADING_DATE DESC, SHIPMENT_NO';
        
        // 전체 건수 조회
        const countQuery = query.replace('SELECT LOADING_DATE,', 'SELECT COUNT(*) as TOTAL_COUNT FROM (SELECT LOADING_DATE,').replace(' ORDER BY LOADING_DATE DESC, SHIPMENT_NO', ') AS CountTable');
        const countResult = await request.query(countQuery);
        const totalCount = countResult.recordset[0].TOTAL_COUNT;
        
        // 페이징 적용
        query += ` OFFSET ${offset} ROWS FETCH NEXT ${limitNum} ROWS ONLY`;

        const result = await request.query(query);
        
        res.json({
            success: true,
            data: result.recordset,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limitNum),
                hasNext: pageNum < Math.ceil(totalCount / limitNum)
            }
        });

    } catch (error) {
        console.error('출하예고 조회 에러:', error);
        res.status(500).json({
            success: false,
            message: '출하예고 조회 중 오류가 발생했습니다.'
        });
    }
});

// 출하예고 상세 조회
router.get('/shipment/:shipmentNo', checkSession, async (req, res) => {
    try {
        const { shipmentNo } = req.params;
        
        const pool = getPool();
        const request = pool.request();
        
        const result = await request
            .input('shipmentNo', sql.VarChar, shipmentNo)
            .query(`
                SELECT * 
                FROM TB_ORDER 
                WHERE SHIPMENT_NO = @shipmentNo 
                AND DELETE_BIT = 'N'
            `);
        
        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: '해당 예고번호의 데이터를 찾을 수 없습니다.'
            });
        }

        res.json({
            success: true,
            data: result.recordset[0]
        });

    } catch (error) {
        console.error('출하예고 상세 조회 에러:', error);
        res.status(500).json({
            success: false,
            message: '출하예고 상세 조회 중 오류가 발생했습니다.'
        });
    }
});

module.exports = router;