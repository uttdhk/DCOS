# 🚀 실제 환경 설정 가이드

## 1. 환경 변수 설정

### `.env` 파일을 실제 DB 정보로 수정:

```env
# Database Configuration
DB_SERVER=YOUR_MSSQL_SERVER_IP
DB_USER=YOUR_USERNAME
DB_PASSWORD=YOUR_PASSWORD
DB_DATABASE=YOUR_DATABASE_NAME
DB_PORT=1433

# Server Configuration
PORT=3000
SESSION_SECRET=your_unique_secret_key

# Environment
NODE_ENV=production
```

## 2. MSSQL 연결 설정

### 보안 설정 (필요시 수정):
```javascript
// backend/config/database.js
options: {
    encrypt: true,  // Azure SQL Database인 경우 true
    trustServerCertificate: false  // 프로덕션에서는 false 권장
}
```

## 3. 실제 테이블 생성 스크립트

### TB_USR 테이블:
```sql
CREATE TABLE TB_USR (
  USR_ID          varchar(8)  NOT NULL,
  USR_NAME        varchar(20) NULL,
  USR_PASSWD      varchar(16)  NOT NULL,
  CONSTRAINT [PK_USR] PRIMARY KEY CLUSTERED (USR_ID ASC)
);

-- 테스트 사용자 데이터
INSERT INTO TB_USR VALUES ('admin', '관리자', 'admin123');
INSERT INTO TB_USR VALUES ('user01', '홍길동', 'user123');
INSERT INTO TB_USR VALUES ('test', '테스트', 'test123');
```

### TB_CODE 테이블:
```sql
CREATE TABLE TB_CODE (
  CODE_ID         varchar(10) NOT NULL,
  CODE_NO         varchar(20) NOT NULL,
  CODE_NAME       varchar(40) NOT NULL,
  DESCRIPTION     varchar(100) NULL,
  CRE_DATE        datetime    NULL,
  CRE_USER_NAME   varchar(20) NULL,
  CHA_DATE        datetime    NULL,
  CHA_USER_NAME   varchar(20) NULL,
  CODE_NAME_ENG   varchar(40) NULL,
  CONSTRAINT PK_CODE PRIMARY KEY CLUSTERED (CODE_ID ASC, CODE_NO ASC)
);

-- 출하지 코드 데이터
INSERT INTO TB_CODE VALUES ('DPT', '1000', '울산공장', '울산 출하지', GETDATE(), 'admin', NULL, NULL, 'Ulsan Plant');
INSERT INTO TB_CODE VALUES ('DPT', '1001', '여수공장', '여수 출하지', GETDATE(), 'admin', NULL, NULL, 'Yeosu Plant');
```

## 4. 서버 재시작

```bash
# PM2 재시작
cd backend
npx pm2 restart fuel-delivery-system

# 또는 새로 시작
npx pm2 delete fuel-delivery-system
npx pm2 start ecosystem.config.js
```

## 5. 연결 테스트

### 로그 확인:
```bash
npx pm2 logs fuel-delivery-system --nostream
```

### 성공 메시지 확인:
- "MSSQL 데이터베이스 연결 성공"

### 실패 시 확인사항:
1. DB 서버 IP/포트 확인
2. 방화벽 설정
3. SQL Server 원격 접속 허용 설정
4. 사용자 권한 확인

## 6. API 테스트

### 브라우저에서 테스트:
1. 로그인 시도
2. 출하예고 조회
3. 출하실적 조회

### 에러 발생 시:
```bash
# 상세 로그 확인
npx pm2 logs fuel-delivery-system --lines 50
```