"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 임시 콘솔 출력 (실제로는 API 요청)
    console.log("새 글 작성됨:", { title, content });

    // 작성 완료 후 게시판 메인으로 이동
    router.push("/main");
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
    </div>
  );
}
