"use client";

import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PageProps {
  params: {
    idx: string;
  };
}

// 게시글 타입 정의 (백엔드 응답에 맞게 수정)
interface Post {
  id: string;
  title: string;
  content: string;
  picture?: string;
  authorUsername?: string;
  author?: string; // 기존 호환성을 위해 유지
  date?: string;
  summary?: string;
}

export default function PostDetailPage({ params }: PageProps) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 백엔드 데이터를 프론트엔드 형식으로 변환하는 함수
  const transformBackendData = (data: Record<string, unknown>): Post => {
    return {
      id: String(data.id || data._id || ''),
      title: String(data.title || ''),
      content: String(data.content || ''),
      picture: data.picture ? String(data.picture) : undefined,
      authorUsername: data.authorUsername ? String(data.authorUsername) : undefined,
      author: data.authorUsername ? String(data.authorUsername) : String(data.author || ''), // authorUsername을 author로도 매핑
      date: data.date ? String(data.date) : undefined,
      summary: data.summary ? String(data.summary) : undefined,
    };
  };

  // API에서 게시글 데이터 가져오기
  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/posts/${params.idx}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          notFound();
          return;
        }
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      
      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const transformedData = transformBackendData(data);
      setPost(transformedData);
    } catch (err) {
      console.error('게시글 조회 에러:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPost();
  }, [params.idx]);

  // 로딩 중일 때
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-md border border-pink-100">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
            <span className="ml-2 text-pink-600">게시글을 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="min-h-screen bg-pink-50 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-md border border-pink-100">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong>오류:</strong> {error}
          </div>
          <button
            onClick={() => router.back()}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-xl shadow transition"
          >
            ← 뒤로가기
          </button>
        </div>
      </div>
    );
  }

  // 게시글이 없을 때
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-md border border-pink-100 space-y-6">
        <h1 className="text-2xl font-bold text-pink-700">{post.title}</h1>
        
        {/* 작성자와 날짜 정보 (있는 경우에만 표시) */}
        {(post.authorUsername || post.date) && (
          <div className="text-sm text-gray-500 border-b border-pink-100 pb-4">
            {post.authorUsername && <span>작성자: {post.authorUsername}</span>}
            {post.authorUsername && post.date && <span className="mx-2">•</span>}
            {post.date && <span>작성일: {post.date}</span>}
          </div>
        )}
        
        <p className="text-gray-800 whitespace-pre-line">
          {post.content || '내용이 없습니다.'}
        </p>

        {/* 오른쪽 정렬된 뒤로가기 버튼 */}
        <div className="pt-4 flex justify-between gap-3">
          <button
            onClick={() => router.push(`/edit/${post.id}`)}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-xl shadow transition"
          >
            수정
          </button>
          <button
            onClick={() => router.back()}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-xl shadow transition"
          >
            ← 뒤로가기
          </button>
        </div>
      </div>
    </div>
  );
}
