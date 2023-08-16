import React from "react";
import Link from "next/link";
import Progressbar from "./progressbar";

function HistoryLink({
  title, createdAt, animationkey, percentage,
}) {
  return (
    <div className="p-4 bg-white rounded w-[70vw] h-30 hover:bg-slate-200 truncate m-4">
      <div className="flex">
        <Link href="/article/demo" passHref>
          <div className="mb-2 overflow-hidden text-xl font-semibold">
            {title}
          </div>
        </Link>
        <div className="ml-auto">
          <Progressbar percentage={percentage} animationkey={animationkey} />
        </div>
      </div>
      <div className="flex mt-4">
        <p className="ml-6 text-slate-400">{createdAt}</p>
        <Link href="/" passHref className="mt-auto ml-auto">
          <div className="block bg-[#8198BF] text-white px-4 py-1 rounded-md hover:bg-[#638ace]">測驗傳送門</div>
        </Link>
      </div>
    </div>
  );
}

export default HistoryLink;
