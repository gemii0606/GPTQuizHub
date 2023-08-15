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
  <Link
    href={`/questionsbanks/${questionsBank.id}`}
    key={questionsBank.id}
    className="cursor-pointer flex items-center mb-2.5"
  >
    <p className="text-lg font-bold leading-6">{questionsBank.title}</p>
  </Link>
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
