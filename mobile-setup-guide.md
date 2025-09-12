# 📱 Windows에서 React Native 앱 개발 환경 설정

## 1. Node.js 설치
1. https://nodejs.org 방문
2. LTS 버전 다운로드 및 설치 (v18 이상 권장)
3. 설치 확인: `node --version`, `npm --version`

## 2. Git 설치
1. https://git-scm.com/download/win 방문
2. Git for Windows 다운로드 및 설치
3. 설치 확인: `git --version`

## 3. Android Studio 설치 (Android 개발용)
1. https://developer.android.com/studio 방문
2. Android Studio 다운로드 및 설치
3. SDK Manager에서 다음 설치:
   - Android SDK Platform 33
   - Android SDK Build-Tools
   - Android Emulator
   - Intel x86 Emulator Accelerator (HAXM installer)

### Android Studio 환경변수 설정:
```bash
# Windows 환경변수에 추가
ANDROID_HOME=C:\Users\[사용자명]\AppData\Local\Android\Sdk
Path에 추가:
%ANDROID_HOME%\emulator
%ANDROID_HOME%\platform-tools
```

## 4. Expo CLI 설치
```bash
npm install -g @expo/cli
```

## 5. EAS CLI 설치 (앱 빌드용)
```bash
npm install -g eas-cli
```

## 6. 개발 도구 설치
### Visual Studio Code
1. https://code.visualstudio.com 방문
2. VS Code 다운로드 및 설치
3. 유용한 확장팩 설치:
   - React Native Tools
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter

## 7. 실제 기기 테스트용 앱 설치
### Android:
- Google Play에서 "Expo Go" 앱 설치

### iOS:
- App Store에서 "Expo Go" 앱 설치

## 8. 설치 확인
```bash
node --version          # v18+ 확인
npm --version           # 9+ 확인  
expo --version          # 최신 버전 확인
eas --version           # 최신 버전 확인
adb devices             # Android 디바이스 연결 확인
```

## 9. 프로젝트 클론 및 실행
```bash
# 프로젝트 클론
git clone https://github.com/uttdhk/DCOS.git
cd DCOS

# 모바일 프로젝트로 이동
cd mobile

# 의존성 설치
npm install

# 개발 서버 실행
expo start
```

## 10. 앱 테스트 방법
### 실제 기기:
1. Expo Go 앱 실행
2. QR 코드 스캔하여 앱 실행

### Android 에뮬레이터:
1. Android Studio에서 AVD Manager 실행
2. 가상기기 생성 및 실행
3. `expo start` 후 'a' 키 눌러서 Android 에뮬레이터로 실행

### iOS 시뮬레이터 (macOS만 가능):
- Windows에서는 iOS 시뮬레이터 불가
- 실제 iPhone으로만 테스트 가능