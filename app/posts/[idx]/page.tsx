"use client";

import { notFound, useRouter } from "next/navigation";

interface PageProps {
  params: {
    idx: string;
  };
}

const dummyPosts = [
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

export default function PostDetailPage({ params }: PageProps) {
  const router = useRouter();
  const post = dummyPosts.find((p) => p.id === params.idx);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-md border border-pink-100 space-y-6">
        <h1 className="text-2xl font-bold text-pink-700">{post.title}</h1>
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>

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
