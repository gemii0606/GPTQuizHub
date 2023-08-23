"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import nookies from "nookies";
import Image from "next/image";
import Navbar from "../../components/navbar";
import Articlelink from "../../components/articles/articlelink";
import ArticleSidebar from "../../components/articles/article-sidebar";

function Page() {
  const [listArticles, setListArticles] = useState([]);
  const [showArticles, setShowArticles] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const articlesApi = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/search`, {
        headers: {
          Authorization: `Bearer ${nookies.get().access_token}`,
        }
      });
      setListArticles(response.data.data.articles);
      console.log(listArticles);
      if (response.data.data.length !== 0) {
        setShowArticles(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const filteredArticles = selectedTag
    ? listArticles.filter((article) => article.tag === selectedTag)
    : listArticles;
  useEffect(() => {
    articlesApi();
  }, []);
  return (
    <div className="bg-[#F9F9F9] h-full w-full  m-0">
      <Navbar />
      {showArticles ? (
        <div className="flex justify-center p-8">
          <ArticleSidebar onTagButtonClick={setSelectedTag} name="文章" />
          <div>
            {filteredArticles.map((article) => (
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
        <div className="flex items-center justify-center w-full h-screen bg-white">
          <div>No article, go create one!</div>
          <Image src="/walker.gif" alt="alpaca" height={150} width={150} />
          {/* <Image src="/loading.png" alt="loading" height={30} width={30} className="animate-spin" /> */}
        </div>
      )}
    </div>
  );
}

export default Page;
