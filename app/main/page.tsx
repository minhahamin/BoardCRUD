"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const allPosts = [
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

const PAGE_SIZE = 5;

export default function BoardMainPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);

  // 현재 페이지에 보여줄 글들
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPosts = allPosts.slice(startIndex, startIndex + PAGE_SIZE);

  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);

  const goPrev = () => {
    setCurrentPage((p) => (p > 1 ? p - 1 : p));
  };

  const goNext = () => {
    setCurrentPage((p) => (p < totalPages ? p + 1 : p));
  };

  return (
    <div className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-pink-200 py-4 px-6 shadow-md flex justify-between items-center">
        <h1 className="text-xl font-bold text-pink-800">💗 Hong Board</h1>
        <div className="flex items-center gap-4">
          <span className="text-pink-700 text-sm">안녕하세요, 관리자님!</span>
          <a
            href="/"
            className="bg-white text-pink-700 px-3 py-1 rounded-lg shadow-sm hover:bg-pink-100 transition text-sm"
          >
            로그아웃
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto py-10 px-4 space-y-6">
        {/* New Post Button */}
        <div className="flex justify-end mb-4">
          <a
            href="/write"
            className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition"
          >
            ✏️ 새 글 작성
          </a>
        </div>

        {/* Posts Table */}
        <div className="w-full">
          <table className="min-w-full bg-white border border-pink-100 rounded-xl overflow-hidden shadow">
            <thead className="bg-pink-100 text-pink-700">
              <tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">번호</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">제목</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">작성자</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">작성일</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">내용</th>
                <th className="px-4 py-3 text-center whitespace-nowrap"></th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {currentPosts.map((post, idx) => (
                <tr
                  key={post.id}
                  onClick={() => router.push(`/posts/${post.id}`)}
                  className="border-t border-pink-100 hover:bg-pink-50 transition cursor-pointer"
                >
                  <td className="px-4 py-3 whitespace-nowrap">{startIndex + idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-pink-800 whitespace-nowrap">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{post.author}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{post.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{post.summary}</td>
                  <td className="px-4 py-3 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(`삭제 요청: 게시글 ID ${post.id}`);
                        alert("삭제 기능은 아직 구현되지 않았습니다.");
                      }}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      🗑 삭제
                    </button>
                  </td>
                </tr>
              ))}

              {currentPosts.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      </main>
    </div>
  );
}
