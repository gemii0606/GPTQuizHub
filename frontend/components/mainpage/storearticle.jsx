import React, { useState } from "react";
import Swal from "sweetalert2";

function Storearticle() {
  const [total, setTotal] = useState(""); // 初始總題數
  const [easy, setEasy] = useState(""); // 初始簡易題數
  const [medium, setMedium] = useState(""); // 初始中等題數
  const [hard, setHard] = useState("");
  function error1() {
    Swal.fire(
      "錯誤:題目大於10題",
      "最多產生10題喔！",
      "error",
    );
  }
  function error2(totalQuestion) {
    Swal.fire(
      "錯誤：簡易、中等和困難題目總數大於總題數",
      `你設定了${totalQuestion}題`,
      "error",
    );
  }
  function error3(totalQuestion) {
    Swal.fire(
      "錯誤：簡易、中等和困難題目總數少於總題數",
      `你設定了${totalQuestion}題`,
      "error",
    );
  }
  function handleTotal() {
    const totalQuestion = parseInt(easy, 10) + parseInt(medium, 10) + parseInt(hard, 10);
    if (total > 10) error1();
    else if (totalQuestion > total) error2(totalQuestion);
    else if (totalQuestion < total) error3(totalQuestion);
  }
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
      <textarea className="w-full px-3 py-2 mb-2 rounded-md bg-slate-200 h-[50vh] ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF] resize-none" placeholder="Relation between Java and Javascript is like dog and hotdog." />
      <p className="mt-1 mb-2 text-base">題目設定</p>
      <div className="flex items-center w-full h-24 p-2 bg-white rounded">
        <p className="ml-6 text-base font-bold">總題數:</p>
        <input
          placeholder="最多10題"
          className="px-3 py-2 ml-2 rounded-md w-24 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
        <p className="ml-10 text-base font-bold">題目難易度</p>
        <p className="ml-6 text-base font-bold">簡易:</p>
        <input
          className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          value={easy}
          onChange={(e) => setEasy(e.target.value)}
        />
        <p className="ml-6 text-base font-bold">中等:</p>
        <input
          className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          value={medium}
          onChange={(e) => setMedium(e.target.value)}
        />
        <p className="ml-6 text-base font-bold">困難:</p>
        <input
          className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          value={hard}
          onChange={(e) => setHard(e.target.value)}
        />
      </div>
      <button type="button" className="block bg-[#8198BF] text-white px-6 py-1 rounded-md mt-4 ml-auto hover:bg-[#638ace]" onClick={handleTotal}>儲存文章</button>
    </div>
  );
}

export default Storearticle;
