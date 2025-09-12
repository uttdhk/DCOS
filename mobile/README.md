# 🚛 탱크로리 출하시스템 모바일 앱

React Native (Expo)로 개발된 탱크로리 출하 관리 시스템 모바일 앱입니다.

## 📱 주요 기능

- **사용자 로그인**: 간편한 ID 기반 로그인
- **출하예고 조회**: 실시간 출하 예정 정보 확인
- **출하실적 조회**: 완료된 출하 실적 및 품질 정보
- **출하전표 보기**: 상세 출하전표 내용 확인
- **오프라인 지원**: 네트워크 연결 상태와 관계없이 안정적 동작

## 🛠️ 개발 환경

### 필수 요구사항
- Node.js 18+
- Expo CLI
- Android Studio (Android 개발)
- Xcode (iOS 개발, macOS만)

### Windows에서 설치 및 실행

1. **의존성 설치**
```bash
npm install
```

2. **개발 서버 시작**
```bash
npm start
# 또는
expo start
```

3. **앱 실행**
- **Android 에뮬레이터**: `a` 키 누르기
- **실제 기기**: Expo Go 앱에서 QR 코드 스캔

## 📦 빌드 및 배포

### APK 빌드 (Android)
```bash
# 개발용 빌드
eas build --platform android --profile development

# 배포용 빌드
eas build --platform android --profile production
```

### IPA 빌드 (iOS)
```bash
# 개발용 빌드
eas build --platform ios --profile development

# 배포용 빌드
eas build --platform ios --profile production
```

### 앱스토어 제출
```bash
# Google Play Store
eas submit --platform android

# Apple App Store
eas submit --platform ios
```

## 🔧 환경 설정

### API 서버 URL 변경
`app.json` 파일의 `extra.apiBaseUrl`을 수정하세요:
```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "https://your-backend-server.com"
    }
  }
}
```

### 앱 정보 수정
`app.json`에서 다음 정보를 수정할 수 있습니다:
- 앱 이름: `name`
- 앱 ID: `slug`
- 버전: `version`
- 패키지명: `android.package`, `ios.bundleIdentifier`

## 📂 프로젝트 구조

```
mobile/
├── App.tsx                 # 메인 앱 컴포넌트
├── app.json               # Expo 설정
├── assets/                # 앱 아이콘, 스플래시 등
├── src/
│   ├── screens/          # 화면 컴포넌트들
│   │   ├── LoginScreen.tsx
│   │   ├── MainScreen.tsx
│   │   ├── OrderListScreen.tsx
│   │   ├── SlipListScreen.tsx
│   │   ├── OrderDetailScreen.tsx
│   │   ├── SlipDetailScreen.tsx
│   │   └── TicketScreen.tsx
│   ├── services/         # API 서비스
│   │   └── ApiService.ts
│   └── utils/            # 유틸리티 함수들
│       └── formatters.ts
└── README.md
```

## 🔐 보안

- 세션 기반 인증
- Expo SecureStore를 사용한 안전한 데이터 저장
- HTTPS 통신

## 🚀 배포

### 개발 버전 테스트
1. Expo Go 앱 설치
2. `expo start` 실행
3. QR 코드 스캔하여 앱 테스트

### 프로덕션 배포
1. EAS Build로 APK/IPA 생성
2. Google Play Console / App Store Connect에 업로드
3. 검토 후 스토어 출시

## 📞 지원

개발자: uttdhk  
Repository: https://github.com/uttdhk/DCOS