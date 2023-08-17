"use client";

import Link from "next/link";
import QuestionBankSideBar from "../../components/QuestionBankSideBar";

const MockData = [
  {
    id: 1,
    title: "React 是什麼?",
  },
  {
    id: 2,
    title: "Docker 是什麼?",
  },
  {
    id: 3,
    title:
      ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
  },
];
const questionsBankItems = MockData.map((questionsBank) => (
  <div
    key={questionsBank.id}
    className="flex items-center justify-between px-4 py-2 mb-3 border rounded-lg"
  >
    <div>
      <p className="max-w-6xl mr-3 text-2xl font-bold leading-6 truncate">{questionsBank.title}</p>
    </div>
    <div className="flex items-center">
      <div className="block text-base font-bold text-white bg-[#8198BF] py-2.5 px-4 rounded-md hover:opacity-50 mr-5">
        <Link
          href={`/questionsbanks/${questionsBank.id}`}
          className="flex items-center cursor-pointer"
        >
          複習
        </Link>
      </div>
      <div>
        <Link
          href={`/quiz/${questionsBank.id}`}
          className="block text-base font-bold text-white bg-[#25B857] py-2.5 px-4 rounded-md hover:opacity-50"
        >
          測驗連結
        </Link>
      </div>
    </div>
  </div>
));
function Page() {
  return (
    <div className="flex justify-center mt-20">
      <div className="mr-10">
        <QuestionBankSideBar />
      </div>
      <div className="flex flex-col min-w-[60rem] rounded-lg bg-white border p-4 mr-6">
        <h1 className="mb-5 text-2xl font-bold leading-6">題庫</h1>
        {questionsBankItems}
      </div>
    </div>
  );
}

export default Page;
