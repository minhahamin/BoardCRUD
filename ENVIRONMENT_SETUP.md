# 환경 변수 설정 가이드

이 프로젝트는 Next.js와 백엔드 API를 연동하는 게시판 애플리케이션입니다. 배포 시 환경 변수를 올바르게 설정해야 합니다.

## 1. 로컬 개발 환경 설정

프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하세요:

```bash
# API 설정
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# 개발 환경 설정
NODE_ENV=development
```

## 2. Vercel 배포 환경 설정

### 방법 1: Vercel 대시보드에서 설정

1. Vercel 프로젝트 대시보드 접속
2. **Settings** → **Environment Variables** 클릭
3. 다음 변수 추가:

| 변수명 | 값 | 설명 |
|--------|-----|------|
| `NEXT_PUBLIC_API_BASE_URL` | `https://your-backend-domain.vercel.app` | 백엔드 API 서버 URL |

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 루트에서 실행
vercel env add NEXT_PUBLIC_API_BASE_URL
```

## 3. 환경별 설정 예시

### 개발 환경
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 스테이징 환경
```bash
NEXT_PUBLIC_API_BASE_URL=https://staging-backend.vercel.app
```

### 프로덕션 환경
```bash
NEXT_PUBLIC_API_BASE_URL=https://production-backend.vercel.app
```

## 4. 환경 변수 사용법

### 클라이언트 사이드 (컴포넌트)
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// API 호출
const response = await fetch(`${API_BASE_URL}/writes`);
```

### 서버 사이드 (API 라우트)
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 백엔드 API 호출
const response = await fetch(`${BACKEND_URL}/writes`);
```

## 5. 주의사항

- `NEXT_PUBLIC_` 접두사가 붙은 변수만 클라이언트 사이드에서 사용 가능
- 환경 변수 변경 후에는 서버 재시작 필요
- `.env.local` 파일은 `.gitignore`에 포함되어 Git에 커밋되지 않음
- 프로덕션 환경에서는 HTTPS URL 사용 권장

## 6. 문제 해결

### 환경 변수가 적용되지 않는 경우
1. 서버 재시작 확인
2. 변수명 철자 확인
3. `NEXT_PUBLIC_` 접두사 확인

### CORS 오류가 발생하는 경우
백엔드에서 프론트엔드 도메인을 허용하도록 설정 필요

### API 연결이 안 되는 경우
1. 백엔드 서버 상태 확인
2. URL 형식 확인
3. 네트워크 연결 상태 확인 