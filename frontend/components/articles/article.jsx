import React from "react";
import Image from "next/image";

function Article({
  title, tag, createdAt, content
}) {
  return (
    <div className="m-10 p-10 bg-white rounded-lg w-[80vw] min-h-[80vh]">
      <div className="border-b-2">
        <p className="py-4 text-3xl font-semibold">
          {title}
        </p>
        <div className="flex items-center">
          <div className="my-2 ml-2 text-base">
            建立日期：
            {createdAt}
          </div>
          <div className="flex items-center justify-center ml-auto">
            <div>
              <Image src="/tag.png" alt="tag" width={20} height={20} className="mt-1 mr-2" />
            </div>
            <div className="mt-1 font-bold text-slate-400">
              {tag}
            </div>
          </div>
        </div>
      </div>
      <p className="p-6">{content}</p>
    </div>
  );
}

export default Article;
