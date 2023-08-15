import React from "react";
import Image from "next/image";

const navbar = () => {
  return (
    <div className="bg-white w-full h-auto p-2.5 border-b-2 flex items-center">
      <p className="text-5xl text-[#8198BF] inter">GPTQuizHub</p>
      <div className="h-6 ml-8 text-base font-bold">
        <button type="button" className="ml-2 mr-2 border-[#8198BF] hover:border-b-4">歷史文章</button>
        <button type="button" className="ml-2 mr-2 border-[#8198BF] hover:border-b-4">題庫</button>
        <button type="button" className="ml-2 mr-2 border-[#8198BF] hover:border-b-4">測驗</button>
        <button type="button" className="ml-2 mr-2 border-[#8198BF] hover:border-b-4">測驗紀錄</button>
      </div>
      <Image src="/user.png" alt="User" width={40} height={40} className="ml-auto" />
    </div>
  );
};

export default navbar;
