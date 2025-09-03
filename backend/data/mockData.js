// 데모용 목업 데이터

// 사용자 데이터
const mockUsers = [
    { USR_ID: 'admin', USR_NAME: '관리자' },
    { USR_ID: 'user01', USR_NAME: '홍길동' },
    { USR_ID: 'user02', USR_NAME: '김철수' },
    { USR_ID: 'test', USR_NAME: '테스트' }
];

// 출하지 코드 데이터
const mockPlants = [
    { PLANT_CODE: '1000', PLANT_NAME: '울산공장' },
    { PLANT_CODE: '1001', PLANT_NAME: '여수공장' },
    { PLANT_CODE: '1002', PLANT_NAME: '대산공장' },
    { PLANT_CODE: '1003', PLANT_NAME: '온산공장' }
];

// 출하예고 데이터
const mockOrders = [
    {
        LOADING_DATE: '20250903',
        SHIPMENT_NO: 'SH20250903001',
        PLANT_CODE: '1000',
        PLANT_NAME: '울산공장',
        TRIP: '01',
        SOLD_TO_CODE: 'C001',
        SOLD_TO_NAME: 'GS칼텍스',
        SHIP_TO_CODE: 'S001',
        SHIP_TO_NAME: '부산주유소',
        CARRIER_CODE: 'T001',
        CARRIER_NAME: '한국운송',
        VEHICLE_NO: '12가3456',
        VEHICLE_CARD_NO: '123456',
        VEHICLE_NAME: '탱크로리1호',
        DRIVER_CODE: 'D001',
        DRIVER_NAME: '김기사',
        ORDER_TYPE: 'YOR',
        MTRL_CODE: 'M001',
        MTRL_NAME: '휘발유(RON92)',
        GN_INDICATOR: '1',
        ORDER_QTY: '20000',
        UOM: 'L',
        MIX_RATE: '',
        ARMY_CODE: '',
        ADDITIVE: 'Y',
        E_SLIP: 'Y',
        DELETE_BIT: 'N',
        INTERFACE_DATE: '20250903',
        INTERFACE_TIME: '080000',
        SYSTEM_DATE: '20250903',
        SYSTEM_TIME: '080030',
        STATUS: '0'
    },
    {
        LOADING_DATE: '20250903',
        SHIPMENT_NO: 'SH20250903002',
        PLANT_CODE: '1000',
        PLANT_NAME: '울산공장',
        TRIP: '01',
        SOLD_TO_CODE: 'C002',
        SOLD_TO_NAME: 'SK에너지',
        SHIP_TO_CODE: 'S002',
        SHIP_TO_NAME: '서울주유소',
        CARRIER_CODE: 'T002',
        CARRIER_NAME: '대한운송',
        VEHICLE_NO: '34나7890',
        VEHICLE_CARD_NO: '789012',
        VEHICLE_NAME: '탱크로리2호',
        DRIVER_CODE: 'D002',
        DRIVER_NAME: '이기사',
        ORDER_TYPE: 'YOR',
        MTRL_CODE: 'M002',
        MTRL_NAME: '경유',
        GN_INDICATOR: '2',
        ORDER_QTY: '25000',
        UOM: 'L',
        MIX_RATE: '',
        ARMY_CODE: 'A123456',
        ADDITIVE: 'N',
        E_SLIP: 'Y',
        DELETE_BIT: 'N',
        INTERFACE_DATE: '20250903',
        INTERFACE_TIME: '090000',
        SYSTEM_DATE: '20250903',
        SYSTEM_TIME: '090030',
        STATUS: '1'
    }
];

// 출하실적 데이터
const mockSlips = [
    {
        LOADING_DATE: '20250902',
        SHIPMENT_NO: 'SH20250902001',
        PLANT_CODE: '1000',
        PLANT_NAME: '울산공장',
        TRIP: '01',
        EXC_VENDOR: '',
        EXC_VENDOR_NAME: '',
        SOLD_TO_CODE: 'C001',
        SOLD_TO_NAME: 'GS칼텍스',
        SHIP_TO_CODE: 'S001',
        SHIP_TO_NAME: '부산주유소',
        CARRIER_CODE: 'T001',
        CARRIER_NAME: '한국운송',
        VEHICLE_NO: '12가3456',
        VEHICLE_CARD_NO: '123456',
        VEHICLE_NAME: '탱크로리1호',
        DRIVER_CODE: 'D001',
        DRIVER_NAME: '김기사',
        ORDER_TYPE: 'YOR',
        ORDER_MTRL_CODE: 'M001',
        ORDER_MTRL_NAME: '휘발유(RON92)',
        SALES_MTRL_CODE: 'M001',
        SALES_MTRL_NAME: '휘발유(RON92)',
        GN_INDICATOR: '1',
        SALES_QTY: '19850',
        SALES_UOM: 'L',
        GROSS_QTY: '20000',
        GROSS_UOM: 'L',
        NET_QTY: '19850',
        NET_UOM: 'L15',
        DENSITY: '0.7450',
        TEMPERATURE: '15.2',
        SURFUR: '0.01',
        MIX_RATE: '',
        ARMY_CODE: '',
        ADDITIVE: 'Y',
        E_SLIP: 'Y',
        DELETE_BIT: 'N',
        INTERFACE_DATE: '20250902',
        INTERFACE_TIME: '140000',
        SYSTEM_DATE: '20250902',
        SYSTEM_TIME: '140030',
        SEND_BIT: 'Y',
        STATUS_CODE: '53',
        STATUS_TEXT: '정상',
        ORDER_STATUS: '2'
    }
];

module.exports = {
    mockUsers,
    mockPlants,
    mockOrders,
    mockSlips
};