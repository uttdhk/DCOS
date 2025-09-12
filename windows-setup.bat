@echo off
echo ==========================================
echo  탱크로리 출하시스템 모바일 앱 개발환경 설정
echo ==========================================

echo.
echo [1/5] Node.js 설치 확인...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js가 설치되지 않았습니다. https://nodejs.org 에서 설치해주세요.
    pause
    exit /b 1
) else (
    echo Node.js 설치됨: 
    node --version
)

echo.
echo [2/5] Expo CLI 설치...
npm install -g @expo/cli
if %errorlevel% neq 0 (
    echo Expo CLI 설치 실패
    pause
    exit /b 1
)

echo.
echo [3/5] EAS CLI 설치...
npm install -g eas-cli
if %errorlevel% neq 0 (
    echo EAS CLI 설치 실패
    pause
    exit /b 1
)

echo.
echo [4/5] 프로젝트 의존성 설치...
cd mobile
npm install
if %errorlevel% neq 0 (
    echo 의존성 설치 실패
    pause
    exit /b 1
)

echo.
echo [5/5] 설치 완료 확인...
echo.
echo === 설치된 버전 정보 ===
echo Node.js: 
node --version
echo NPM: 
npm --version
echo Expo CLI: 
expo --version
echo EAS CLI: 
eas --version

echo.
echo ==========================================
echo  설치 완료!
echo ==========================================
echo.
echo 다음 단계:
echo 1. Android Studio 설치 (Android 개발용)
echo 2. 실제 기기에 Expo Go 앱 설치
echo 3. "npm start" 실행하여 개발 서버 시작
echo.
echo 자세한 가이드는 mobile-setup-guide.md 참조
echo.
pause