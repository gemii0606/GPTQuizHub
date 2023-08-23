"use client";

import { useState, useEffect } from "react";
import QuestionsBanksCard from "../../components/questionbanks/QuestionBankCard";
import Navbar from "../../components/navbar";
import ArticleSidebar from "../../components/articles/article-sidebar";
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
  const filteredQuizzes = selectTag
    ? quizList.filter((quiz) => quiz.tag === selectTag)
    : quizList;
  const questionsBankItems = filteredQuizzes.map((questionsBank) => (
    <QuestionsBanksCard questionsBank={questionsBank} key={questionsBank.id} />
  ));
  return (
    <div>
      <Navbar />
      <div className="flex justify-center p-8">
        <div className="mr-10">
          <ArticleSidebar name="題庫" onTagButtonClick={setSelectTag} />
        </div>
        <div className="flex flex-col min-w-[60rem] rounded-lg bg-white p-4">
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
