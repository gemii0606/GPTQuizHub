"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import nookies from "nookies";
import Navbar from "../../components/navbar";
import Articlelink from "../../components/articles/articlelink";
import ArticleSidebar from "../../components/articles/article-sidebar";

function Page() {
  const [listArticles, setListArticles] = useState([]);
  const [showAriticles, setShowArticles] = useState([]);
  const articlesApi = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/search`, {
        headers: {
          Authorization: `Bearer ${nookies.get().access_token}`,
        }
      });
      setListArticles(response.data.data.articles);
      console.log(listArticles);
      if (listArticles.length !== 0) {
        setShowArticles(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    articlesApi();
  }, []);
  return (
    <div className="bg-[#F9F9F9] h-full w-full  m-0">
      <Navbar />
      {showAriticles ? (
        <div className="flex justify-center p-8">
          <ArticleSidebar />
          <div>
            {listArticles.map((article) => (
              <Articlelink
                key={article.id}
                id={article.id}
                title={article.title}
                createdAt={article.created_at}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-screen bg-white">
          You don&apos;t have any article yet, go and create one!
        </div>
      )}
    </div>
  );
}

export default Page;
