"use client";

import React from "react";
import Navbar from "../../components/navbar";
import Articlelink from "../../components/articles/articlelink";
import ArticleSidebar from "../../components/articles/article-sidebar";

const page = () => {
  const fakeData = {
    data: {
      article: [
        {
          id: 1,
          title: "三分鐘了解React?",
          created_at: "2023-08-13",
        },
        {
          id: 2,
          title: "Docker武功大全?",
          created_at: "2023-08-13",
        },
        {
          id: 3,
          title: "「草泥馬」為什麼會沖你吐口水",
          created_at: "2023-08-24",
        },
      ],
    },
  };
  return (
    <div className="bg-[#F9F9F9] h-screen w-full  m-0">
      <Navbar />
      <div className="flex justify-center p-8">
        <ArticleSidebar />
        <div>
          {fakeData.data.article.map((article) => (
            <Articlelink
              key={article.id}
              title={article.title}
              createdAt={article.created_at}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
