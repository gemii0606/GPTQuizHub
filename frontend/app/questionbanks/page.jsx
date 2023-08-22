"use client";

import { useState, useEffect } from "react";
import QuestionBankSideBar from "../../components/questionbanks/QuestionBankSideBar";
import QuestionsBanksCard from "../../components/questionbanks/QuestionBankCard";
import Navbar from "../../components/navbar";
import useQuizList from "../../hooks/useQuizList";

function Page() {
  const [cursor, setCursor] = useState(null);
  const [quizList, setQuizList] = useState([]);
  const [selectTag, setSelectTag] = useState("");
  const { quizzes, nextCursor, isLoading, isError } = useQuizList(selectTag);
  useEffect(() => {
    setQuizList(quizzes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizzes]);
  const questionsBankItems = quizList.map((questionsBank) => (
    <QuestionsBanksCard questionsBank={questionsBank} key={questionsBank.id} />
  ));
  return (
    <div>
      <Navbar />
      <div className="flex justify-center mt-20">
        <div className="mr-10">
          <QuestionBankSideBar setSelectTag={setSelectTag} />
        </div>
        <div className="flex flex-col min-w-[60rem] rounded-lg bg-white border p-4 mr-6">
          <h1 className="mb-5 text-2xl font-bold leading-6">題庫</h1>
          {questionsBankItems}
          {isLoading && <p>Loading...</p>}
          {isError && <p>An error occurred while fetching data.</p>}
          {nextCursor && (
            <button type="button" onClick={() => setCursor(nextCursor)}>
              {cursor}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
