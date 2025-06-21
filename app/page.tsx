// app/page.tsx
"use client";
import { useState } from "react"; 
//import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
  //const router = useRouter();

//  const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // 로그인 처리 (예: API 요청 → 성공 시 이동)
//     console.log("로그인 시도:", { id, password });

//     // ✅ 로그인 성공 시 게시판 메인 페이지로 이동
//     router.push("/mainpage");
//   };



 return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-300 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/30">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pink-700">💗 WELCOME 💗</h1>
          <p className="text-sm text-pink-500 mt-2">로그인 후 게시판을 이용해보세요 💌</p>
        </div>

        <form 
        //onSubmit={handleSubmit} 
        className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-pink-700">
              ID
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              value={id}
              onChange={(e) => setID(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-pink-700">
              PW
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
            />
          </div>

            <a
              href="/main"
              className="block text-center w-full bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold py-2.5 rounded-xl shadow-md hover:shadow-xl transition duration-200"
            >
              로그인
            </a>
        </form>

        <p className="text-center text-sm mt-6 text-pink-600">
          아직 계정이 없으신가요?{" "}
          <a href="/signup" className="text-pink-700 hover:underline font-semibold">
            회원가입
          </a>
        </p>
      </div>
    </div>
  );
}
