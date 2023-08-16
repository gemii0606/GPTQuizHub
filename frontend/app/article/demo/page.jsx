import React from "react";
import Navbar from "../../../components/navbar";
import Article from "../../../components/articles/article";

function page() {
  return (
    <div className="bg-[#F9F9F9] min-h-screen w-full  m-0">
      <Navbar />
      <div className="flex justify-center">
        <Article />
      </div>
    </div>
  );
}

export default page;
