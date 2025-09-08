# 🚛 탱크로리 출하 시스템

MSSQL 데이터베이스 기반 휘발유/경유 탱크로리 출하 관리 시스템

## 📋 프로젝트 개요

- **목적**: 탱크로리를 통한 휘발유, 경유 등 석유제품 출하 업무 관리
- **기능**: 출하예고 조회, 출하실적 조회, 사용자 인증 및 세션 관리
- **플랫폼**: 웹 애플리케이션 (모바일 반응형 지원)

## 🏗️ 시스템 구조

### Backend
- **Framework**: Node.js + Express
- **Database**: MSSQL Server (현재 데모용 목업 데이터 사용)
- **Session**: Express-session (30분 자동 연장)
- **API**: RESTful API

### Frontend
- **Technology**: Vanilla JavaScript (프레임워크 없음)
- **Design**: 반응형 CSS (모바일 우선)
- **UI/UX**: 산업용 시스템에 특화된 직관적 인터페이스

## 📊 데이터베이스 테이블

### TB_USR (사용자 테이블)
- 사용자 ID, 이름, 비밀번호 관리

### TB_ORDER (출하예고 테이블)
- 출하 예정 정보 관리
- 거래처, 납지처, 차량, 기사, 제품 정보

### TB_SLIP (출하실적 테이블)
- 실제 출하 완료 정보 관리
- 수량, 밀도, 온도, 품질 정보

### TB_CODE (코드 테이블)
- 출하지, 제품 등 각종 코드 관리

## 🚀 실행 방법

### 1. 의존성 설치
```bash
cd backend
npm install
```

### 1.1 의존성 설치(오프라인에서는...)
```bash
1. [온라인PC에서] https://nodejs.org/en/download/에서 Nodejs 다운로드
  다운로드 링크 : https://nodejs.org/dist/v22.19.0/node-v22.19.0-x64.msi
2. [온라인PC에서] 설치 후 powershell에서 아래 명령어 수행하여 정상 설치 확인
  node -v
  npm -v
3. [온라인PC에서] npm 패키지 다운로드
   cd backend
   npm install --ignore-scripts
   해당 node_modules 폴더와 package-lock.json을 통째로 압축 → USB로 오프라인 PC에 옮기기
4. [오프라인PC에서] 프로젝트 폴더에 풀어주면 바로 실행 가능
```

### 2. 환경 설정
`.env` 파일에서 데이터베이스 연결 정보 설정

```bash
    # Database Configuration
    DB_SERVER=your-mssql-server-ip-or-hostname
    DB_USER=your-username
    DB_PASSWORD=your-password
    DB_DATABASE=your-database-name
    DB_PORT=1433
    
    # Server Configuration
    PORT=3000
    SESSION_SECRET=fuel_delivery_secret_key_2024
    
    # Environment
    NODE_ENV=production
```

### 3. 서버 실행
```bash
# PM2를 사용한 서비스 시작
npx pm2 start ecosystem.config.js

# 개발 모드 (nodemon)
npm run dev
```

### 4. 접속
브라우저에서 `http://localhost:3000` 접속

## 👤 로그인 정보

**데모용 사용자 계정:**
- admin (관리자)
- user01 (홍길동)
- user02 (김철수)
- test (테스트)

> 현재 비밀번호 검증은 구현되지 않음 (추후 구현 예정)

## 📱 주요 기능

### 1. 로그인/로그아웃
- 사용자 ID 기반 로그인
- 30분 세션 유지 (활동 시 자동 연장)
- 세션 만료 시 자동 로그아웃

### 2. 출하예고 조회
- **검색 조건**: 출하지, 출하일자, 예고번호, 차량명, 기사명
- **표시 항목**: 출하지명, 출하일자, 회차, 거래처명, 납지처명, 차량명, 기사명, 제품명, 출하정산방식, 주문량, 출하단위, 전자전표
- **상세보기**: 행 클릭 시 상세 정보 패널 표시

### 3. 출하실적 조회
- **검색 조건**: 출하지, 출하일자, 예고번호, 차량명, 기사명
- **표시 항목**: 출하지명, 출하일자, 회차, 거래처명, 납지처명, 차량명, 기사명, 제품명, 출하정산방식, 판매량, 판매단위, 전자전표
- **상세보기**: 밀도, 온도, 황함량 등 상세 품질 정보 표시

## 📱 모바일 지원

- 반응형 디자인으로 모바일 기기 지원
- 터치 인터페이스 최적화
- 가로/세로 화면 회전 지원

## 🔐 보안 기능

- 세션 기반 인증
- 30분 자동 세션 만료
- API 엔드포인트 보호
- CORS 설정

## 🎨 UI/UX 특징

- **산업용 시스템 디자인**: 명확한 정보 구조
- **색상 코딩**: 상태별 시각적 구분
- **아이콘 활용**: 직관적인 정보 전달
- **반응형 테이블**: 모바일에서도 편리한 데이터 조회

## 🔧 개발 환경

- **Node.js**: v16+
- **Express**: v4.18+
- **MSSQL**: v10+
- **PM2**: 프로세스 관리

## 📞 지원

개발자: uttdhk  
프로젝트: DCOS  
Repository: https://github.com/uttdhk/DCOS

---

**⚠️ 주의사항**: 현재는 데모용 목업 데이터를 사용하고 있습니다. 실제 운영 시에는 MSSQL 데이터베이스 연결 설정이 필요합니다.
