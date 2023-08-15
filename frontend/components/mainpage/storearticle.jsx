import React from "react";

function Storearticle() {
  return (
    <div className="p-8 m-0">
      <p className="mb-2 text-base">文章標題</p>
      <input className="px-3 py-2 mb-2 rounded-md w-80 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]" />
      <p className="mt-1 mb-2 text-base">文章類別</p>
      <select id="options" name="options" className=" mb-2 block w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-slate-200 ring-1 ring-[#8198BF] focus:border-[#8198BF]">
        <option value="未分類">未分類</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </select>
      <p className="mt-1 mb-2 text-base">文章內容</p>
      <textarea className="w-full px-3 py-2 mb-2 rounded-md bg-slate-200 h-[50vh] ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]" placeholder="Relation between Java and Javascript is like dog and hotdog." />
      <p className="mt-1 mb-2 text-base">題目設定</p>
      <div className="flex items-center w-full h-24 p-2 bg-white rounded">
        <p className="ml-6 text-base font-bold">總題數:</p>
        <input placeholder="最多10題" className="px-3 py-2 ml-2 rounded-md w-24 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]" />
        <p className="ml-10 text-base font-bold">題目難易度</p>
        <p className="ml-6 text-base font-bold">簡易:</p>
        <input className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]" />
        <p className="ml-6 text-base font-bold">中等:</p>
        <input className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]" />
        <p className="ml-6 text-base font-bold">困難:</p>
        <input className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]" />
      </div>
      <button type="button" className="block bg-[#8198BF] text-white px-6 py-1 rounded-md mt-4 ml-auto">儲存文章</button>
    </div>
  );
}

export default Storearticle;
