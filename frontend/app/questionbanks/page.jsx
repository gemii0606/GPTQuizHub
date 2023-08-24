"use client";

import { useState } from "react";
import Image from "next/image";
import QuestionsBanksCard from "../../components/questionbanks/QuestionBankCard";
import Navbar from "../../components/navbar";
import ArticleSidebar from "../../components/articles/article-sidebar";
import useQuizList from "../../hooks/useQuizList";

function Page() {
  const [cursor, setCursor] = useState(null);
  const [selectTag, setSelectTag] = useState("");
  const { quizzes, nextCursor, isLoading, isError } = useQuizList(selectTag);
  const filteredQuizzes = selectTag ? quizzes.filter((quiz) => quiz.tag === selectTag) : quizzes;
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
          {isLoading && (
            <div className="flex items-center justify-center w-full h-screen bg-white">
              <div>Loading...</div>
              <Image src="/walkcat.gif" alt="alpaca" height={150} width={150} />
              {/* <Image src="/loading.png" alt="loading" height={30} width={30} className="animate-spin" /> */}
            </div>
          )}
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
