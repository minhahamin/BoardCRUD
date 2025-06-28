"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// API 기본 URL 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

interface PageProps {
  params: {
    id: string;
  };
}

// 게시글 타입 정의
interface Post {
  id: string;
  title: string;
  content: string;
  picture?: string;
  authorUsername?: string;
}

export default function EditPostPage({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // JWT 토큰 가져오기
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // 기존 게시글 데이터 불러오기
  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/writes/${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('게시글을 찾을 수 없습니다.');
          setTimeout(() => router.push('/main'), 2000);
          return;
        }
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      setPost(data);
      
      // 폼 데이터 초기화
      setFormData({
        title: data.title || '',
        content: data.content || '',
      });
    } catch (err) {
      console.error('게시글 조회 에러:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      setTimeout(() => router.push('/main'), 2000);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPost();
  }, [params.id, router]);

  // 폼 입력 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 수정 저장 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = getAuthToken();
    
    if (!token) {
      showNotification('로그인이 필요합니다.', 'error');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      showNotification('제목과 내용을 모두 입력해주세요.', 'warning');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/writes/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 403) {
          showNotification('자신이 작성한 게시글만 수정할 수 있습니다.', 'warning');
          return;
        }
        
        if (response.status === 401) {
          showNotification('로그인이 필요합니다.', 'error');
          return;
        }
        
        if (response.status === 404) {
          showNotification('게시글을 찾을 수 없습니다.', 'error');
          return;
        }
        
        throw new Error(errorData.message || '게시글 수정에 실패했습니다.');
      }

      const data = await response.json();
      console.log('게시글 수정 성공:', data);
      
      showNotification('게시글이 성공적으로 수정되었습니다.', 'success');
      
      // 성공 후 상세 페이지로 이동
      setTimeout(() => {
        router.push(`/posts/${params.id}`);
      }, 1500);
    } catch (err) {
      console.error('게시글 수정 에러:', err);
      showNotification(err instanceof Error ? err.message : '게시글 수정 중 오류가 발생했습니다.', 'error');
    } finally {
      setSaving(false);
    }
  };

  // 취소 처리
  const handleCancel = () => {
    router.push('/main');
  };

  // 알림창 표시 함수
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // 4초 후 자동으로 숨기기
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

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
  if (error && !post) {
    return (
      <div className="min-h-screen bg-pink-50 py-10 px-4">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-md border border-pink-100">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong>오류:</strong> {error}
          </div>
          <button
            onClick={handleCancel}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-xl shadow transition"
          >
            ← 메인으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-md border border-pink-100 space-y-6">
        <h1 className="text-2xl font-bold text-pink-700">✏️ 게시글 수정</h1>
        
        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <strong>오류:</strong> {error}
          </div>
        )}

        {/* 수정 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 입력 */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          {/* 내용 입력 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              내용
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={10}
              className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          {/* 버튼 그룹 */}
          <div className="flex justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-xl shadow transition"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-xl shadow transition disabled:opacity-50"
            >
              {saving ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>

      {/* 우측 상단 알림창 */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
          <div className={`
            px-6 py-4 rounded-lg shadow-lg border-l-4 min-w-80
            ${notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' : ''}
            ${notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' : ''}
            ${notification.type === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' : ''}
            ${notification.type === 'info' ? 'bg-blue-50 border-blue-500 text-blue-800' : ''}
          `}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {/* 아이콘 */}
                {notification.type === 'success' && (
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'warning' && (
                  <svg className="w-5 h-5 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-medium">{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(prev => ({ ...prev, show: false }))}
                className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}