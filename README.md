# Next.js 게시판 프로젝트

이 프로젝트는 Next.js와 Tailwind CSS를 사용한 게시판 CRUD 애플리케이션입니다.

## 기능

- 게시글 목록 조회
- 게시글 상세 조회
- 게시글 작성
- 게시글 수정
- 게시글 삭제
- 반응형 UI (Tailwind CSS)
- 토스트 알림 시스템

## Getting Started

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 프로젝트 구조

```
board/
├── app/
│   ├── api/           # API 라우트
│   ├── main/          # 메인 페이지 (게시글 목록)
│   ├── posts/         # 게시글 상세 페이지
│   ├── write/         # 게시글 작성 페이지
│   ├── edit/          # 게시글 수정 페이지
│   └── signup/        # 회원가입 페이지
└── package.json
```

## 기술 스택

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: REST API (외부 서버)
- **상태 관리**: React Hooks
- **스타일링**: Tailwind CSS

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
