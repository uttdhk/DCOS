// 인증 관련 기능

class AuthManager {
    constructor() {
        this.initEventListeners();
    }

    // 이벤트 리스너 초기화
    initEventListeners() {
        // 로그인 폼 이벤트
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // 로그아웃 버튼 이벤트
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }

        // 모달 닫기 이벤트
        const modalClose = document.getElementById('modal-close');
        const modalOk = document.getElementById('modal-ok');
        
        if (modalClose) {
            modalClose.addEventListener('click', hideMessage);
        }
        
        if (modalOk) {
            modalOk.addEventListener('click', hideMessage);
        }

        // Enter 키로 로그인
        const userIdInput = document.getElementById('user-id');
        if (userIdInput) {
            userIdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loginForm.dispatchEvent(new Event('submit'));
                }
            });
        }
    }

    // 로그인 처리
    async handleLogin(e) {
        e.preventDefault();
        
        const userId = document.getElementById('user-id').value.trim();
        const messageEl = document.getElementById('login-message');
        
        // 입력 검증
        if (!userId) {
            this.showLoginMessage('사용자ID를 입력해주세요.', 'error');
            return;
        }

        try {
            showLoading();
            
            // 로그인 API 호출
            const response = await authAPI.login(userId);
            
            if (response.success) {
                this.showLoginMessage('로그인 성공', 'success');
                
                // 사용자 정보 저장
                this.setUser(response.user);
                
                // 메인 화면으로 이동
                setTimeout(async () => {
                    showMainScreen();
                    this.clearLoginForm();
                    
                    // 메인 화면 초기화
                    if (typeof window.app !== 'undefined') {
                        await window.app.initMainScreen();
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            this.showLoginMessage(error.message || '로그인 중 오류가 발생했습니다.', 'error');
        } finally {
            hideLoading();
        }
    }

    // 로그아웃 처리
    async handleLogout() {
        try {
            showLoading();
            
            await authAPI.logout();
            
            // 세션 정보 정리
            this.clearUser();
            
            // 로그인 화면으로 이동
            showLoginScreen();
            
            showMessage('로그아웃', '로그아웃 되었습니다.');
            
        } catch (error) {
            console.error('로그아웃 에러:', error);
            // 로그아웃 실패해도 클라이언트에서는 로그인 화면으로 이동
            this.clearUser();
            showLoginScreen();
        } finally {
            hideLoading();
        }
    }

    // 세션 확인
    async checkSession() {
        try {
            const response = await authAPI.checkSession();
            
            if (response.success) {
                this.setUser(response.user);
                return true;
            }
        } catch (error) {
            console.log('세션 없음:', error.message);
        }
        
        return false;
    }

    // 사용자 정보 설정
    setUser(user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        
        // 화면에 사용자명 표시
        const userNameEl = document.getElementById('user-name');
        if (userNameEl) {
            userNameEl.textContent = `${user.userName} (${user.userId})`;
        }
    }

    // 사용자 정보 가져오기
    getUser() {
        const userStr = sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // 사용자 정보 정리
    clearUser() {
        sessionStorage.removeItem('user');
    }

    // 로그인 메시지 표시
    showLoginMessage(message, type) {
        const messageEl = document.getElementById('login-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `message ${type}`;
            messageEl.style.display = 'block';
            
            // 3초 후 메시지 숨김
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 3000);
        }
    }

    // 로그인 폼 초기화
    clearLoginForm() {
        const form = document.getElementById('login-form');
        if (form) {
            form.reset();
        }
        
        const messageEl = document.getElementById('login-message');
        if (messageEl) {
            messageEl.style.display = 'none';
        }
    }

    // 초기화
    async init() {
        try {
            // 세션 확인
            const hasSession = await this.checkSession();
            
            if (hasSession) {
                showMainScreen();
            } else {
                showLoginScreen();
            }
        } catch (error) {
            console.log('초기화 실패:', error);
            showLoginScreen();
        }
    }
}

// 전역 인증 매니저 인스턴스
const authManager = new AuthManager();