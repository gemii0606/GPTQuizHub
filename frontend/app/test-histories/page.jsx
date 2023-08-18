"use client";

import React from "react";
import Navbar from "../../components/navbar";
import HistoryLink from "../../components/test-histories/historylink";
import HistoriesSidebar from "../../components/test-histories/histories-sidebar";

const page = () => {
  const fakeData = {
    data: {
      article: [
        {
          id: 1,
          title: "三分鐘了解React?",
          created_at: "2023-08-13",
          percentage: "40",
        },
        {
          id: 2,
          title: "Docker武功大全?",
          created_at: "2023-08-13",
          percentage: "70",
        },
        {
          id: 3,
          title: "「草泥馬」為什麼會沖你吐口水",
          created_at: "2023-08-24",
          percentage: "95",
        },
      ],
    },
  };

  return (
    <div className="bg-[#F9F9F9] h-full w-full  m-0">
      <Navbar />
      <div className="flex justify-center p-8">
        <HistoriesSidebar />
        <div>
          {fakeData.data.article.map((article, index) => (
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
    </div>
  );
};

export default page;
