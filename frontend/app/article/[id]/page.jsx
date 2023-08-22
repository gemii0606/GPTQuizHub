"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import nookies from "nookies";
import Navbar from "../../../components/navbar";
import Article from "../../../components/articles/article";

function Page({ params }) {
  const [article, setArticle] = useState([]);
  const detailApi = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/articles/${params.id}`, {
        headers: {
          Authorization: `Bearer ${nookies.get().access_token}`,
        }
      });
      console.log(response.data.data);
      setArticle(response.data.data.article);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    detailApi();
  }, []);
  return (
    <div className="bg-[#F9F9F9] min-h-screen w-full  m-0">
      <Navbar />
      <div className="flex justify-center">
        <Article
          title={article.title}
          tag={article.tag}
          createdAt={article.created_at}
          content={article.content}
        />
      </div>
    </div>
  );
}

export default Page;
