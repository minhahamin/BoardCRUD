"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // TODO: 서버에 회원가입 요청
    console.log("회원가입 정보:", { email, id, password });

    alert("회원가입이 완료되었습니다!");
    router.push("/"); // 회원가입 완료 후 로그인 페이지로 이동
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-300 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-700">💗 회원가입</h1>
          <p className="text-sm text-pink-500 mt-2">지금 가입하고 게시판을 이용해보세요!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-pink-700">이메일</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-pink-700">아이디</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-pink-700">비밀번호</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-pink-700">비밀번호 확인</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-xl transition duration-200"
          >
            💕 회원가입 완료
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-pink-600">
          이미 계정이 있으신가요?{" "}
          <a href="/" className="text-pink-700 hover:underline font-semibold">
            로그인
          </a>
        </p>
      </div>
    </div>
  );
}
