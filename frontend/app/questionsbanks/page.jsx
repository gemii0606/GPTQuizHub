"use client";

import Link from "next/link";

const MockData = [
  {
    id: 1,
    title: "React 是什麼?",
  },
  {
    id: 2,
    title: "Docker 是什麼?",
  },
];
const questionsBankItems = MockData.map((questionsBank) => (
  <div
    key={questionsBank.id}
    className="flex items-center justify-between px-4 py-2 mb-3 border rounded-lg"
  >
    <div>
      <Link
        href={`/questionsbanks/${questionsBank.id}`}
        className="flex items-center cursor-pointer"
      >
        <p className="text-lg font-bold leading-6">{questionsBank.title}</p>
      </Link>
    </div>
    <div>
      <Link
        href={`/quiz/${questionsBank.id}`}
        className="block text-base font-bold text-white bg-[#8198BF] py-2.5 px-4 rounded-md hover:opacity-50"
      >
        測驗連結
      </Link>
    </div>
  </div>
));
function Page() {
  return (
    <div className="flex justify-center mt-20">
      <div className="flex flex-col min-w-[60rem] rounded-lg bg-white border p-4 mr-6">
        <h1 className="mb-5 text-lg font-bold leading-6">題庫</h1>
        {questionsBankItems}
      </div>
    </div>
  );
}

export default Page;
