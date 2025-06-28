"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// 게시글 타입 정의
interface Post {
  id: number;
  title: string;
  authorUsername?: string;
  content?: string;
  picture?: string;
}

const PAGE_SIZE = 5;

export default function BoardMainPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 로그인 사용자 이름 상태
  const [username, setUsername] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });

  // JWT 토큰 가져오기
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  // API에서 게시글 데이터 가져오기
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/writes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('게시글을 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      
      // 백엔드 데이터를 프론트엔드 형식으로 변환
      const transformedData = data.map((item: Record<string, unknown>) => ({
        id: Number(item.id),
        title: String(item.title || ''),
        content: String(item.content || ''),
        authorUsername: item.authorUsername ? String(item.authorUsername) : undefined,
        picture: item.picture ? String(item.picture) : undefined,
      }));
      
      setPosts(transformedData);
      
      // 새로고침 성공 시 알림 (처음 로드 시에는 알림 표시하지 않음)
      if (posts.length > 0) {
        showNotification('게시글이 새로고침되었습니다.', 'success');
      }
    } catch (err) {
      console.error('게시글 조회 에러:', err);
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      showNotification('게시글을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchPosts();
  }, []);

  // 사용자 정보 로드
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // 현재 페이지에 보여줄 글들
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPosts = posts.slice(startIndex, startIndex + PAGE_SIZE);
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);

  const goPrev = () => {
    setCurrentPage((p) => (p > 1 ? p - 1 : p));
  };

  const goNext = () => {
    setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  };

  // 새로고침 함수
  const handleRefresh = () => {
    // 부드러운 새로고침을 위한 상태 관리
    setLoading(true);
    setError(null);
    
    // 약간의 지연을 두어 사용자가 새로고침이 시작됨을 인지할 수 있도록 함
    setTimeout(() => {
      fetchPosts();
    }, 300);
  };

  // 게시글 삭제 함수
  const handleDelete = async (postId: number) => {
    const token = getAuthToken();
    
    if (!token) {
      showNotification('로그인이 필요합니다.', 'error');
      return;
    }

    // 현재 로그인한 사용자와 게시글 작성자 비교
    const post = posts.find(p => p.id === postId);
    const currentUser = localStorage.getItem('username');
    
    if (!post) {
      showNotification('삭제하려는 게시글을 찾을 수 없습니다.', 'error');
      setShowDeleteConfirm(null);
      return;
    }
    
    if (post.authorUsername !== currentUser) {
      showNotification('자신이 작성한 게시글만 삭제할 수 있습니다.', 'warning');
      setShowDeleteConfirm(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/writes/${postId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 403) {
          showNotification('자신이 작성한 게시글만 삭제할 수 있습니다.', 'warning');
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
        
        throw new Error(errorData.message || '게시글 삭제에 실패했습니다.');
      }

      // 삭제 성공 시 게시글 목록 새로고침
      showNotification('게시글이 삭제되었습니다.', 'success');
      fetchPosts();
    } catch (error) {
      console.error('삭제 에러:', error);
      showNotification(error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.', 'error');
    } finally {
      setShowDeleteConfirm(null);
    }
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

  // 로그아웃 함수
  const handleLogout = () => {
    // 로컬스토리지에서 토큰과 사용자 정보 제거
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    showNotification('로그아웃되었습니다.', 'success');
    
    // 알림창이 표시될 시간을 주기 위해 1.5초 후 페이지 이동
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-pink-200 py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-pink-800">💗 Hong Board</h1>
        <div className="flex items-center gap-4">
          <span className="text-pink-700 text-sm">
            {username ? `안녕하세요, ${username}님!` : "안녕하세요, 000님!"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-white text-pink-700 px-3 py-1 rounded-lg shadow-sm hover:bg-pink-100 transition text-sm"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto py-10 px-4 space-y-6">
        {/* New Post Button and Refresh */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-pink-300 hover:bg-pink-400 text-pink-800 font-semibold py-2 px-4 rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                새로고침 중...
              </>
            ) : (
              <>
                🔄 새로고침
              </>
            )}
          </button>
          <a
            href="/write"
            className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
          >
            ✏️ 새 글 작성
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <strong>오류:</strong> {error}
          </div>
        )}

        {/* 삭제 확인 다이얼로그 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">게시글 삭제</h3>
              <p className="text-gray-600 mb-6">정말로 이 게시글을 삭제하시겠습니까?</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                >
                  취소
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Table */}
        <div className="w-full">
          <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
            <table className="min-w-full bg-white border border-pink-100 rounded-xl overflow-hidden shadow">
              <thead className="bg-pink-100 text-pink-700">
                <tr>
                  <th className="px-4 py-3 text-left whitespace-nowrap">번호</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">제목</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">작성자</th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">내용</th>
                  <th className="px-4 py-3 text-center whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                        <span className="ml-2 text-pink-600">게시글을 불러오는 중...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentPosts.length > 0 ? (
                  currentPosts.map((post, idx) => (
                    <tr
                      key={post.id}
                      onClick={() => router.push(`/posts/${post.id}`)}
                      className="border-t border-pink-100 hover:bg-pink-50 transition cursor-pointer"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-pink-800 whitespace-nowrap">
                        {post.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{post.authorUsername || '작성자 없음'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{post.content}</td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteConfirm(post.id);
                          }}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          🗑 삭제
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-400">
                      게시글이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {!loading && posts.length > 0 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={goPrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-pink-400 text-white hover:bg-pink-500"
              }`}
            >
              이전
            </button>
            <span className="text-pink-700 font-semibold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={goNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-pink-400 text-white hover:bg-pink-500"
              }`}
            >
              다음
            </button>
          </div>
        )}
      </main>

      {/* 우측 상단 알림창 */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
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