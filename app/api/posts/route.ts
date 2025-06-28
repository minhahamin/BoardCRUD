import { NextRequest, NextResponse } from 'next/server';

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  author: string;
  date: string;
  summary: string;
}

// 환경 변수 설정
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// GET 요청 처리 - 게시글 전체 조회
export async function GET() {
  try {
    // 백엔드 API 호출
    const response = await fetch(`${BACKEND_URL}/writes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 필요한 경우 인증 헤더 추가
        // 'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend posts response:', data); // 백엔드 응답 데이터 로깅
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    
    // 개발 환경에서는 더미 데이터 반환
    if (process.env.NODE_ENV === 'development') {
      const dummyPosts: Post[] = [
        {
          id: 1,
          title: "게시판 첫 글입니다",
          author: "홍길동",
          date: "2025.06.21",
          summary: "여기는 게시판의 첫 글입니다. 내용을 간단히 소개합니다.",
        },
        {
          id: 2,
          title: "두 번째 글입니다",
          author: "이민하",
          date: "2025.06.20",
          summary: "두 번째 글 요약입니다. 게시판을 사용해보세요!",
        },
        {
          id: 3,
          title: "세 번째 글입니다",
          author: "박지민",
          date: "2025.06.19",
          summary: "게시판 사용법을 알려드릴게요!",
        },
        {
          id: 4,
          title: "네 번째 글입니다",
          author: "김수현",
          date: "2025.06.18",
          summary: "자유롭게 글을 작성해보세요.",
        },
        {
          id: 5,
          title: "다섯 번째 글입니다",
          author: "이수진",
          date: "2025.06.17",
          summary: "게시판 꾸미기 팁입니다.",
        },
        {
          id: 6,
          title: "여섯 번째 글입니다",
          author: "최민호",
          date: "2025.06.16",
          summary: "더 많은 글을 올려보세요.",
        },
      ];
      
      return NextResponse.json(dummyPosts);
    }
    
    return NextResponse.json(
      { error: '게시글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// POST 요청 처리 - 새 게시글 작성 (필요시)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/writes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '게시글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 