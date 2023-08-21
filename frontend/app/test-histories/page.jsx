"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import nookies from "nookies";
import Navbar from "../../components/navbar";
import HistoryLink from "../../components/test-histories/historylink";
import ArticleSidebar from "../../components/articles/article-sidebar";

function Page() {
  const [listHistories, setListHistories] = useState([]);
  const [noHistory, setNoHistory] = useState(false);
  const historiesApi = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/history`, {
        headers: {
          Authorization: `Bearer ${nookies.get().access_token}`,
        }
      });
      setListHistories(response.data.data.quizzes);
      if (listHistories.length !== 0) {
        setNoHistory(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    historiesApi();
  }, []);

  return (
    <div className="bg-[#F9F9F9] h-full w-full  m-0">
      <Navbar />
      {noHistory ? (
        <div className="flex justify-center p-8">
          <ArticleSidebar />
          <div>
            {listHistories.map((article, index) => (
              <HistoryLink
                key={article.id}
                title={article.title}
                createdAt={article.created_at}
                articlekey={index}
                percentage={article.percentage}
              />
            ))}
          </div>
        </div>
      )
        : (
          <div className="w-full h-screen bg-white">
            You don&apos;t have a quiz record yet, go and answer it!
          </div>
        )}
    </div>
  );
}

export default Page;

// <div>
//   {listHistories.data.data.map((article) => (
//     <HistoryLink
//       key={article.id}
//       title={article.title}
//       createdAt={article.created_at}
//       articlekey={article.quiz_id}
//       percentage={article.accuracy}
//     />
//   ))}
// </div>
