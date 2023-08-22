import React from "react";
import Link from "next/link";

function Articlelink({ title, createdAt, id }) {
  return (
    <div className="p-4 bg-white rounded w-[70vw] h-24 hover:bg-slate-200 truncate m-4">
      <Link href={`/article/${id}`} passHref>
        <div className="mb-2 overflow-hidden text-xl font-semibold truncate">
          {title}
        </div>
      </Link>
      <div className="flex mt-2">
        <p className="ml-6 text-black">{createdAt}</p>
        <Link href={`/questionbanks/${id}`} passHref className="ml-auto ">
          <div className="block bg-[#84C1FF] text-white px-4 py-1 rounded-md hover:bg-[#638ace]">題庫傳送門</div>
        </Link>
      </div>
    </div>
  );
}

export default Articlelink;
