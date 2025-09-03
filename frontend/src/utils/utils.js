// 유틸리티 함수들

// 날짜 포맷팅 (YYYYMMDD -> YYYY-MM-DD)
function formatDate(dateStr) {
    if (!dateStr || dateStr.length !== 8) return '';
    return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}

// 날짜 포맷팅 (YYYY-MM-DD -> YYYYMMDD)
function formatDateToApi(dateStr) {
    if (!dateStr) return '';
    return dateStr.replace(/-/g, '');
}

// 오늘 날짜 가져오기 (YYYY-MM-DD)
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 오늘 날짜 가져오기 (YYYYMMDD)
function getTodayDateApi() {
    return formatDateToApi(getTodayDate());
}

// 숫자 포맷팅 (천 단위 콤마)
function formatNumber(num) {
    if (!num) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// 출하정산방식 텍스트 변환
function getGnIndicatorText(indicator) {
    switch(indicator) {
        case '1': return 'GROSS출하/GROSS정산';
        case '2': return 'GROSS출하/NET정산';
        case '600': return 'NET출하/NET정산';
        default: return indicator;
    }
}

// 주문형태 텍스트 변환
function getOrderTypeText(orderType) {
    switch(orderType) {
        case 'YOR': return '판매';
        case 'YERO': return '교환';
        case 'YUB': return '이관';
        default: return orderType;
    }
}

// 전자전표 텍스트 변환
function getESlipText(eSlip) {
    return eSlip === 'Y' ? '전자전표' : '종이전표';
}

// 처리상태 텍스트 변환
function getStatusText(status) {
    switch(status) {
        case '0': return '출하전';
        case '1': return '출하중';
        case '2': return '출하완료';
        default: return status;
    }
}

// 첨가제 주입여부 텍스트 변환
function getAdditiveText(additive) {
    return additive === 'Y' ? '주입' : '미주입';
}

// 로딩 표시/숨김
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

// 메시지 모달 표시
function showMessage(title, message, type = 'info') {
    const modal = document.getElementById('message-modal');
    const titleEl = document.getElementById('modal-title');
    const messageEl = document.getElementById('modal-message');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    modal.classList.remove('hidden');
}

// 메시지 모달 숨김
function hideMessage() {
    document.getElementById('message-modal').classList.add('hidden');
}

// 폼 데이터를 객체로 변환
function getFormData(formElement) {
    const formData = new FormData(formElement);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }
    
    return data;
}

// 테이블 행 선택 처리
function handleRowSelection(table, selectedRow, detailCallback) {
    // 기존 선택 해제
    table.querySelectorAll('tr.selected').forEach(row => {
        row.classList.remove('selected');
    });
    
    // 새 행 선택
    selectedRow.classList.add('selected');
    
    // 상세 정보 표시 콜백 실행
    if (detailCallback) {
        detailCallback(selectedRow);
    }
}

// 세션 만료 처리
function handleSessionExpired() {
    showMessage('세션 만료', '세션이 만료되었습니다. 다시 로그인해주세요.', 'warning');
    
    setTimeout(() => {
        hideMessage();
        showLoginScreen();
    }, 2000);
}

// 화면 전환 함수
function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('main-screen').classList.add('hidden');
}

function showMainScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('main-screen').classList.remove('hidden');
}

// 에러 처리 함수
function handleError(error, defaultMessage = '오류가 발생했습니다.') {
    console.error('Error:', error);
    
    let message = defaultMessage;
    if (error.message) {
        message = error.message;
    }
    
    // 세션 만료 체크
    if (error.message && error.message.includes('로그인이 필요') || error.message.includes('세션')) {
        handleSessionExpired();
        return;
    }
    
    showMessage('오류', message, 'error');
}

// 빈 테이블 행 생성
function createEmptyRow(colspan, message = '데이터가 없습니다.') {
    return `<tr><td colspan="${colspan}" class="no-data">${message}</td></tr>`;
}

// 로딩 행 생성
function createLoadingRow(colspan) {
    return `<tr><td colspan="${colspan}" class="loading-row">데이터를 불러오는 중...</td></tr>`;
}