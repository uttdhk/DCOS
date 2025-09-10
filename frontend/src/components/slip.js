// 출하실적 관련 기능

class SlipManager {
    constructor() {
        this.currentData = [];
        this.currentPage = 1;
        this.totalCount = 0;
        this.hasNext = false;
        this.initEventListeners();
    }

    // 이벤트 리스너 초기화
    initEventListeners() {
        // 조회 버튼 이벤트
        const searchBtn = document.getElementById('search-slip');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch(true));
        }
        
        // 더보기 버튼 이벤트
        const loadMoreBtn = document.getElementById('load-more-slip');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMore());
        }

        // Enter 키로 검색
        const inputs = document.querySelectorAll('#slip-screen input');
        inputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch(true);
                }
            });
        });
    }

    // 출하지 코드 로드
    async loadPlantCodes() {
        try {
            const response = await codeAPI.getPlants();
            
            if (response.success) {
                const select = document.getElementById('slip-plant');
                if (select) {
                    // 기존 옵션 제거 (첫 번째 "전체" 옵션 제외)
                    while (select.options.length > 1) {
                        select.remove(1);
                    }
                    
                    // 새 옵션 추가
                    response.data.forEach(plant => {
                        const option = document.createElement('option');
                        option.value = plant.PLANT_CODE;
                        option.textContent = plant.PLANT_NAME;
                        select.appendChild(option);
                    });
                }
            }
        } catch (error) {
            console.error('출하지 코드 로드 실패:', error);
        }
    }

    // 검색 처리
    async handleSearch(reset = false) {
        try {
            showLoading();
            
            // 새 검색인 경우 페이지 리셋
            if (reset) {
                this.currentPage = 1;
                this.currentData = [];
            }
            
            // 검색 조건 수집
            const params = this.getSearchParams();
            params.page = this.currentPage;
            params.limit = 20;
            
            // API 호출
            const response = await slipAPI.getSlips(params);
            
            if (response.success) {
                if (reset) {
                    this.currentData = response.data;
                } else {
                    this.currentData = [...this.currentData, ...response.data];
                }
                
                this.totalCount = response.pagination?.total || response.data.length;
                this.hasNext = response.pagination?.hasNext || false;
                
                this.renderTable(this.currentData);
                this.updateLoadMoreButton();
                
                // 상세 정보 패널 숨김
                document.getElementById('slip-detail').classList.add('hidden');
            }
            
        } catch (error) {
            handleError(error, '출하실적 조회 중 오류가 발생했습니다.');
            this.renderTable([]);
        } finally {
            hideLoading();
        }
    }
    
    // 더보기 처리
    async loadMore() {
        this.currentPage++;
        await this.handleSearch(false);
    }

    // 검색 조건 수집
    getSearchParams() {
        const plantCode = document.getElementById('slip-plant').value;
        const loadingDate = formatDateToApi(document.getElementById('slip-date').value);
        const shipmentNo = document.getElementById('slip-shipment-no').value.trim();
        const vehicleName = document.getElementById('slip-vehicle').value.trim();
        const driverName = document.getElementById('slip-driver').value.trim();

        const params = {};
        
        if (plantCode) params.plantCode = plantCode;
        if (loadingDate) params.loadingDate = loadingDate;
        if (shipmentNo) params.shipmentNo = shipmentNo;
        if (vehicleName) params.vehicleName = vehicleName;
        if (driverName) params.driverName = driverName;

        return params;
    }

    // 테이블 렌더링
    renderTable(data) {
        const tbody = document.getElementById('slip-tbody');
        
        if (!data || data.length === 0) {
            tbody.innerHTML = createEmptyRow(13, '조회된 데이터가 없습니다.');
            this.updateResultInfo(0);
            return;
        }

        const rows = data.map((item, index) => `
            <tr onclick="slipManager.selectRow(${index})" data-index="${index}">
                <td>${index + 1}</td>
                <td>${item.PLANT_NAME || ''}</td>
                <td>${formatDate(item.LOADING_DATE) || ''}</td>
                <td>${item.TRIP || ''}</td>
                <td>${item.SOLD_TO_NAME || ''}</td>
                <td>${item.SHIP_TO_NAME || ''}</td>
                <td>${item.VEHICLE_NAME || ''}</td>
                <td>${item.DRIVER_NAME || ''}</td>
                <td>${item.SALES_MTRL_NAME || ''}</td>
                <td>${getGnIndicatorText(item.GN_INDICATOR)}</td>
                <td>${formatNumber(item.SALES_QTY)}</td>
                <td>${item.SALES_UOM || ''}</td>
                <td>${getESlipText(item.E_SLIP)}</td>
            </tr>
        `).join('');

        tbody.innerHTML = rows;
        this.updateResultInfo(this.totalCount);
    }
    
    // 결과 정보 업데이트
    updateResultInfo(total) {
        const resultInfo = document.getElementById('slip-result-info');
        if (resultInfo) {
            resultInfo.innerHTML = `
                <span class="result-count">조회 결과: <strong>${total}건</strong></span>
                <span class="current-display">현재 표시: <strong>${this.currentData.length}건</strong></span>
            `;
        }
    }
    
    // 더보기 버튼 업데이트
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('load-more-slip');
        if (loadMoreBtn) {
            if (this.hasNext && this.currentData.length > 0) {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.textContent = `더보기 (${this.currentData.length}/${this.totalCount})`;
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    // 행 선택 처리
    selectRow(index) {
        const table = document.getElementById('slip-table');
        const selectedRow = table.querySelector(`tr[data-index="${index}"]`);
        
        if (selectedRow) {
            // 기존 상세 행 제거
            this.removeDetailRow();
            
            handleRowSelection(table, selectedRow, () => {
                this.showDetailInline(this.currentData[index], selectedRow);
            });
        }
    }
    
    // 인라인 상세 정보 표시
    showDetailInline(data, afterRow) {
        const detailRow = document.createElement('tr');
        detailRow.className = 'detail-row';
        detailRow.innerHTML = `
            <td colspan="13" class="detail-cell">
                <div class="inline-detail-content">
                    ${this.generateDetailHTML(data)}
                </div>
            </td>
        `;
        
        afterRow.insertAdjacentElement('afterend', detailRow);
    }
    
    // 상세 행 제거
    removeDetailRow() {
        const existingDetailRow = document.querySelector('.detail-row');
        if (existingDetailRow) {
            existingDetailRow.remove();
        }
    }
    
    // 상세 HTML 생성
    generateDetailHTML(data) {
        return `
            <div class="detail-grid">
                <div class="detail-section">
                    <h4>📋 기본 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">예고번호:</span>
                        <span class="detail-value">${data.SHIPMENT_NO || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">출하일자:</span>
                        <span class="detail-value">${formatDate(data.LOADING_DATE) || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">회차:</span>
                        <span class="detail-value">${data.TRIP || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">주문형태:</span>
                        <span class="detail-value">${getOrderTypeText(data.ORDER_TYPE)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">처리상태:</span>
                        <span class="detail-value status-indicator status-${data.ORDER_STATUS}">${getStatusText(data.ORDER_STATUS)}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🏢 거래처 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">출하지:</span>
                        <span class="detail-value">${data.PLANT_NAME || ''} (${data.PLANT_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">교환사:</span>
                        <span class="detail-value">${data.EXC_VENDOR_NAME || ''} (${data.EXC_VENDOR || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">거래처:</span>
                        <span class="detail-value">${data.SOLD_TO_NAME || ''} (${data.SOLD_TO_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">납지처:</span>
                        <span class="detail-value">${data.SHIP_TO_NAME || ''} (${data.SHIP_TO_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">수송사:</span>
                        <span class="detail-value">${data.CARRIER_NAME || ''} (${data.CARRIER_CODE || ''})</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🚛 차량 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">차량번호:</span>
                        <span class="detail-value">${data.VEHICLE_NO || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">차량명:</span>
                        <span class="detail-value">${data.VEHICLE_NAME || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">차량카드번호:</span>
                        <span class="detail-value">${data.VEHICLE_CARD_NO || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">기사명:</span>
                        <span class="detail-value">${data.DRIVER_NAME || ''} (${data.DRIVER_CODE || ''})</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>⛽ 제품 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">주문제품:</span>
                        <span class="detail-value">${data.ORDER_MTRL_NAME || ''} (${data.ORDER_MTRL_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">판매제품:</span>
                        <span class="detail-value">${data.SALES_MTRL_NAME || ''} (${data.SALES_MTRL_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">출하정산방식:</span>
                        <span class="detail-value">${getGnIndicatorText(data.GN_INDICATOR)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">혼합율:</span>
                        <span class="detail-value">${data.MIX_RATE || ''}${data.MIX_RATE ? '%' : ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">첨가제:</span>
                        <span class="detail-value">${getAdditiveText(data.ADDITIVE)}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>📊 수량 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">판매량:</span>
                        <span class="detail-value">${formatNumber(data.SALES_QTY)} ${data.SALES_UOM || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">GROSS량:</span>
                        <span class="detail-value">${formatNumber(data.GROSS_QTY)} ${data.GROSS_UOM || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">NET량:</span>
                        <span class="detail-value">${formatNumber(data.NET_QTY)} ${data.NET_UOM || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">밀도:</span>
                        <span class="detail-value">${data.DENSITY || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">온도:</span>
                        <span class="detail-value">${data.TEMPERATURE || ''}°C</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">황함량:</span>
                        <span class="detail-value">${data.SURFUR || ''}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>📄 처리 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">전자전표:</span>
                        <span class="detail-value">${getESlipText(data.E_SLIP)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">증빙번호:</span>
                        <span class="detail-value">${data.ARMY_CODE || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">전송상태:</span>
                        <span class="detail-value">${data.SEND_BIT === 'Y' ? '전송완료' : '전송전'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">처리코드:</span>
                        <span class="detail-value">${data.STATUS_CODE || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">처리내용:</span>
                        <span class="detail-value">${data.STATUS_TEXT || ''}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🕒 시간 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">수신일시:</span>
                        <span class="detail-value">${formatDate(data.INTERFACE_DATE)} ${data.INTERFACE_TIME ? data.INTERFACE_TIME.substring(0,2) + ':' + data.INTERFACE_TIME.substring(2,4) + ':' + data.INTERFACE_TIME.substring(4,6) : ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">처리일시:</span>
                        <span class="detail-value">${formatDate(data.SYSTEM_DATE)} ${data.SYSTEM_TIME ? data.SYSTEM_TIME.substring(0,2) + ':' + data.SYSTEM_TIME.substring(2,4) + ':' + data.SYSTEM_TIME.substring(4,6) : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 상세 정보 표시
    showDetail(data) {
        const detailPanel = document.getElementById('slip-detail');
        const detailContent = document.getElementById('slip-detail-content');

        const detailHtml = `
            <div class="detail-grid">
                <div class="detail-section">
                    <h4>📋 기본 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">예고번호:</span>
                        <span class="detail-value">${data.SHIPMENT_NO || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">출하일자:</span>
                        <span class="detail-value">${formatDate(data.LOADING_DATE) || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">회차:</span>
                        <span class="detail-value">${data.TRIP || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">주문형태:</span>
                        <span class="detail-value">${getOrderTypeText(data.ORDER_TYPE)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">처리상태:</span>
                        <span class="detail-value status-indicator status-${data.ORDER_STATUS}">${getStatusText(data.ORDER_STATUS)}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🏢 거래처 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">출하지:</span>
                        <span class="detail-value">${data.PLANT_NAME || ''} (${data.PLANT_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">교환사:</span>
                        <span class="detail-value">${data.EXC_VENDOR_NAME || ''} (${data.EXC_VENDOR || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">거래처:</span>
                        <span class="detail-value">${data.SOLD_TO_NAME || ''} (${data.SOLD_TO_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">납지처:</span>
                        <span class="detail-value">${data.SHIP_TO_NAME || ''} (${data.SHIP_TO_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">수송사:</span>
                        <span class="detail-value">${data.CARRIER_NAME || ''} (${data.CARRIER_CODE || ''})</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🚛 차량 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">차량번호:</span>
                        <span class="detail-value">${data.VEHICLE_NO || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">차량명:</span>
                        <span class="detail-value">${data.VEHICLE_NAME || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">차량카드번호:</span>
                        <span class="detail-value">${data.VEHICLE_CARD_NO || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">기사명:</span>
                        <span class="detail-value">${data.DRIVER_NAME || ''} (${data.DRIVER_CODE || ''})</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>⛽ 제품 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">주문제품:</span>
                        <span class="detail-value">${data.ORDER_MTRL_NAME || ''} (${data.ORDER_MTRL_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">판매제품:</span>
                        <span class="detail-value">${data.SALES_MTRL_NAME || ''} (${data.SALES_MTRL_CODE || ''})</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">출하정산방식:</span>
                        <span class="detail-value">${getGnIndicatorText(data.GN_INDICATOR)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">혼합율:</span>
                        <span class="detail-value">${data.MIX_RATE || ''}${data.MIX_RATE ? '%' : ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">첨가제:</span>
                        <span class="detail-value">${getAdditiveText(data.ADDITIVE)}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>📊 수량 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">판매량:</span>
                        <span class="detail-value">${formatNumber(data.SALES_QTY)} ${data.SALES_UOM || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">GROSS량:</span>
                        <span class="detail-value">${formatNumber(data.GROSS_QTY)} ${data.GROSS_UOM || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">NET량:</span>
                        <span class="detail-value">${formatNumber(data.NET_QTY)} ${data.NET_UOM || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">밀도:</span>
                        <span class="detail-value">${data.DENSITY || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">온도:</span>
                        <span class="detail-value">${data.TEMPERATURE || ''}°C</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">황함량:</span>
                        <span class="detail-value">${data.SURFUR || ''}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>📄 처리 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">전자전표:</span>
                        <span class="detail-value">${getESlipText(data.E_SLIP)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">증빙번호:</span>
                        <span class="detail-value">${data.ARMY_CODE || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">전송상태:</span>
                        <span class="detail-value">${data.SEND_BIT === 'Y' ? '전송완료' : '전송전'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">처리코드:</span>
                        <span class="detail-value">${data.STATUS_CODE || ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">처리내용:</span>
                        <span class="detail-value">${data.STATUS_TEXT || ''}</span>
                    </div>
                </div>

                <div class="detail-section">
                    <h4>🕒 시간 정보</h4>
                    <div class="detail-item">
                        <span class="detail-label">수신일시:</span>
                        <span class="detail-value">${formatDate(data.INTERFACE_DATE)} ${data.INTERFACE_TIME ? data.INTERFACE_TIME.substring(0,2) + ':' + data.INTERFACE_TIME.substring(2,4) + ':' + data.INTERFACE_TIME.substring(4,6) : ''}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">처리일시:</span>
                        <span class="detail-value">${formatDate(data.SYSTEM_DATE)} ${data.SYSTEM_TIME ? data.SYSTEM_TIME.substring(0,2) + ':' + data.SYSTEM_TIME.substring(2,4) + ':' + data.SYSTEM_TIME.substring(4,6) : ''}</span>
                    </div>
                </div>
            </div>
        `;

        detailContent.innerHTML = detailHtml;
        detailPanel.classList.remove('hidden');
    }

    // 초기화
    async init() {
        // 오늘 날짜 설정
        const dateInput = document.getElementById('slip-date');
        if (dateInput) {
            dateInput.value = getTodayDate();
        }

        // 출하지 코드 로드
        await this.loadPlantCodes();
    }
}

// 전역 출하실적 매니저 인스턴스
const slipManager = new SlipManager();
