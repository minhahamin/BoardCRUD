"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    show: false,
    message: '',
    type: 'info'
  });
  const router = useRouter();

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

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token"); // 로그인 시 저장한 JWT 토큰 가져오기
    if (!token) {
      showNotification("로그인 후 작성할 수 있습니다.", "error");
      return;
    }

    const response = await fetch("http://localhost:3000/writes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 토큰 인증 헤더 추가
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      showNotification(`작성 실패: ${errorData.message || "알 수 없는 오류"}`, "error");
      return;
    }

    showNotification("글이 성공적으로 작성되었습니다!", "success");
    
    // 알림창이 표시될 시간을 주기 위해 1.5초 후 페이지 이동
    setTimeout(() => {
      router.push("/main");
    }, 1500);
  } catch (error) {
    console.error("글 작성 중 오류 발생:", error);
    showNotification("네트워크 오류가 발생했습니다.", "error");
  }
};

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-md space-y-6 border border-pink-100">
        <h1 className="text-2xl font-bold text-pink-700 text-center">새 글 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-pink-700 font-medium mb-1">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              placeholder="글 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-pink-700 font-medium mb-1">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 px-4 py-2 border border-pink-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition resize-none"
              placeholder="내용을 입력하세요"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-xl transition duration-200"
          >
            작성 완료
          </button>
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
