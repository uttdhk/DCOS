// 메인 애플리케이션 로직

class App {
    constructor() {
        this.initEventListeners();
    }

    // 이벤트 리스너 초기화
    initEventListeners() {
        // 탭 전환 이벤트
        const tabOrder = document.getElementById('tab-order');
        const tabSlip = document.getElementById('tab-slip');

        if (tabOrder) {
            tabOrder.addEventListener('click', () => this.switchTab('order'));
        }

        if (tabSlip) {
            tabSlip.addEventListener('click', () => this.switchTab('slip'));
        }

        // 세션 연장을 위한 주기적 요청 (25분마다)
        setInterval(() => {
            this.extendSession();
        }, 25 * 60 * 1000); // 25분
    }

    // 탭 전환
    switchTab(tabName) {
        // 모든 탭 버튼에서 active 클래스 제거
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 모든 탭 콘텐츠 숨김
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });

        // 선택된 탭 활성화
        if (tabName === 'order') {
            document.getElementById('tab-order').classList.add('active');
            document.getElementById('order-screen').classList.remove('hidden');
        } else if (tabName === 'slip') {
            document.getElementById('tab-slip').classList.add('active');
            document.getElementById('slip-screen').classList.remove('hidden');
        }

        // 상세 패널 숨김
        document.getElementById('order-detail').classList.add('hidden');
        document.getElementById('slip-detail').classList.add('hidden');
    }

    // 세션 연장
    async extendSession() {
        try {
            // 현재 사용자가 로그인되어 있는지 확인
            const user = authManager.getUser();
            if (!user) return;

            // 메인 화면이 표시되어 있는지 확인
            const mainScreen = document.getElementById('main-screen');
            if (mainScreen.classList.contains('hidden')) return;

            // 세션 확인 API 호출 (이것만으로도 세션이 연장됨)
            await authAPI.checkSession();
            console.log('세션이 연장되었습니다.');
            
        } catch (error) {
            console.log('세션 연장 실패:', error.message);
            
            // 세션이 만료된 경우 로그인 화면으로 이동
            if (error.message && (error.message.includes('로그인이 필요') || error.message.includes('세션'))) {
                handleSessionExpired();
            }
        }
    }

    // 애플리케이션 초기화
    async init() {
        try {
            showLoading();

            // 인증 매니저 초기화
            await authManager.init();
            
            // 메인 화면이 표시된 경우 추가 초기화 수행
            const mainScreen = document.getElementById('main-screen');
            if (!mainScreen.classList.contains('hidden')) {
                await this.initMainScreen();
            }

        } catch (error) {
            console.error('앱 초기화 실패:', error);
            showMessage('초기화 오류', '애플리케이션 초기화 중 오류가 발생했습니다.');
        } finally {
            hideLoading();
        }
    }

    // 메인 화면 초기화
    async initMainScreen() {
        try {
            // 출하예고 매니저 초기화
            await orderManager.init();
            
            // 출하실적 매니저 초기화
            await slipManager.init();
            
            // 기본 탭을 출하예고로 설정
            this.switchTab('order');
            
        } catch (error) {
            console.error('메인 화면 초기화 실패:', error);
            showMessage('초기화 오류', '화면 초기화 중 오류가 발생했습니다.');
        }
    }
}

// DOM이 로드되면 앱 시작
document.addEventListener('DOMContentLoaded', async () => {
    window.app = new App();
    await window.app.init();
});

// 브라우저 새로고침/종료 시 경고 (개발 중에는 주석 처리 가능)
window.addEventListener('beforeunload', (e) => {
    const user = authManager.getUser();
    if (user) {
        e.preventDefault();
        e.returnValue = '페이지를 벗어나시겠습니까? 작업 중인 내용이 있으면 저장되지 않을 수 있습니다.';
    }
});

// 전역 에러 처리
window.addEventListener('error', (e) => {
    console.error('전역 에러:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('처리되지 않은 Promise 거부:', e.reason);
});