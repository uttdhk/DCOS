// API 기본 설정
const API_BASE_URL = '';

// API 호출을 위한 유틸리티 함수
const api = {
    // GET 요청
    async get(url, params = {}) {
        try {
            const urlObj = new URL(API_BASE_URL + url, window.location.origin);
            
            // 쿼리 매개변수 추가
            Object.keys(params).forEach(key => {
                if (params[key] !== '' && params[key] != null) {
                    urlObj.searchParams.append(key, params[key]);
                }
            });

            const response = await fetch(urlObj.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API GET 에러:', error);
            throw error;
        }
    },

    // POST 요청
    async post(url, data = {}) {
        try {
            const response = await fetch(API_BASE_URL + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
            }

            return responseData;
        } catch (error) {
            console.error('API POST 에러:', error);
            throw error;
        }
    }
};

// 인증 관련 API
const authAPI = {
    // 로그인
    async login(userId) {
        return await api.post('/api/auth/login', { userId });
    },

    // 로그아웃
    async logout() {
        return await api.post('/api/auth/logout');
    },

    // 세션 확인
    async checkSession() {
        return await api.get('/api/auth/session');
    }
};

// 코드 관련 API
const codeAPI = {
    // 출하지 코드 조회
    async getPlants() {
        return await api.get('/api/plants');
    },

    // 특정 코드 조회
    async getCodes(codeId) {
        return await api.get(`/api/codes/${codeId}`);
    }
};

// 출하예고 관련 API
const orderAPI = {
    // 출하예고 조회
    async getShipments(params) {
        return await api.get('/api/shipment', params);
    },

    // 출하예고 상세 조회
    async getShipmentDetail(shipmentNo) {
        return await api.get(`/api/shipment/${shipmentNo}`);
    }
};

// 출하실적 관련 API
const slipAPI = {
    // 출하실적 조회
    async getSlips(params) {
        return await api.get('/api/slip', params);
    },

    // 출하실적 상세 조회
    async getSlipDetail(shipmentNo) {
        return await api.get(`/api/slip/${shipmentNo}`);
    },

    // 출하전표 조회
    async getTicket(shipmentNo) {
        return await api.get(`/api/ticket/${shipmentNo}`);
    }
};