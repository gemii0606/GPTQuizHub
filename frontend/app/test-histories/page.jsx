"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import nookies from "nookies";
import Image from "next/image";
import Navbar from "../../components/navbar";
import HistoryLink from "../../components/test-histories/historylink";
import ArticleSidebar from "../../components/articles/article-sidebar";

function Page() {
  const [listHistories, setListHistories] = useState([]);
  const [noHistory, setNoHistory] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const historiesApi = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/history`, {
        headers: {
          Authorization: `Bearer ${nookies.get().access_token}`,
        },
      });
      setListHistories(response.data.data.quizzes);
      if (response.data.data.length !== 0) {
        setNoHistory(true);
      }
      console.log(response);
      console.log(response.data.data.quizzes);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    historiesApi();
  }, []);
  const filteredHistories = selectedTag
    ? listHistories.filter((article) => article.tag === selectedTag)
    : listHistories;

  return (
    <div className="bg-[#F9F9F9] h-full w-full  m-0">
      <Navbar />
      {noHistory ? (
        <div className="flex justify-center p-8">
          <ArticleSidebar name="測驗" onTagButtonClick={setSelectedTag} />
          <div>
            {filteredHistories.map((article, index) => (
              <HistoryLink
                key={article.id}
                title={article.title}
                createdAt={article.created_at}
                articlekey={index}
                percentage={article.accuracy}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-screen bg-white">
          <div>No test, go create an article!</div>
          <Image src="/walker.gif" alt="alpaca" height={150} width={150} />
        </div>
      )}
    </div>
  );
}

export default Page;
