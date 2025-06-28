import { NextRequest, NextResponse } from 'next/server';

// 게시글 타입 정의
interface Post {
  id: string;
  title: string;
  content: string;
  author?: string;
  date?: string;
}

// 환경 변수 설정
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// GET 요청 처리 - 특정 게시글 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // 백엔드 API 호출
    const response = await fetch(`${BACKEND_URL}/writes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: '게시글을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend response data:', data); // 백엔드 응답 데이터 로깅
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    
    // 개발 환경에서는 더미 데이터 반환
    if (process.env.NODE_ENV === 'development') {
      const dummyPosts: Post[] = [
        {
          id: "1",
          title: "게시판 첫 글입니다",
          content: "여기는 게시판의 첫 글입니다. 내용을 간단히 소개합니다.",
        },
        {
          id: "2",
          title: "두 번째 글입니다",
          content: "두 번째 글 요약입니다. 게시판을 사용해보세요!",
        },
        {
          id: "3",
          title: "세 번째 글입니다",
          content: "게시판 사용법을 알려드릴게요!",
        },
        {
          id: "4",
          title: "네 번째 글입니다",
          content: "자유롭게 글을 작성해보세요.",
        },
        {
          id: "5",
          title: "다섯 번째 글입니다",
          content: "게시판 꾸미기 팁입니다",
        },
        {
          id: "6",
          title: "여섯 번째 글입니다",
          content: "더 많은 글을 올려보세요.",
        },
      ];
      
      const post = dummyPosts.find(p => p.id === params.id);
      if (post) {
        return NextResponse.json(post);
      } else {
        return NextResponse.json(
          { error: '게시글을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: '게시글을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// PUT 요청 처리 - 게시글 수정 (필요시)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/writes/${id}`, {
      method: 'PUT',
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
      { error: '게시글 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE 요청 처리 - 게시글 삭제 (필요시)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = params;
    
    const response = await fetch(`${BACKEND_URL}/writes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    return NextResponse.json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: '게시글 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 