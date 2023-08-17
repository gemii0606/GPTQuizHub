import React, { useState } from "react";
import Swal from "sweetalert2";

function Storearticle() {
  const [easy, setEasy] = useState("");
  const [medium, setMedium] = useState("");
  const [hard, setHard] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message

  function handleInputChange(e, difficulty) {
    const newValue = e.target.value;
    switch (difficulty) {
      case "easy":
        setEasy(newValue);
        break;
      case "medium":
        setMedium(newValue);
        break;
      case "hard":
        setHard(newValue);
        break;
      default:
        break;
    }
    // eslint-disable-next-line max-len
    const totalQuestion = parseInt(easy || 0, 10) + parseInt(medium || 0, 10) + parseInt(hard || 0, 10);
    if (totalQuestion > 10) {
      setErrorMessage("題數不可超過10題");
    } else {
      setErrorMessage("");
    }
  }
  function handleSubmit() {
    Swal.fire(
      "Succesfully submit",
      "Let create the questions!",
      "success",
    );
  }
  return (
    <div className="p-8 m-0">
      <form action="" method="post" onSubmit={handleSubmit}>
        <p className="mb-2 text-base">文章標題</p>
        <input required className="px-3 py-2 mb-2 rounded-md w-80 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]" />
        <p className="mt-1 mb-2 text-base">文章類別</p>
        <select id="options" name="options" className=" mb-2 block w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-slate-200 ring-1 ring-[#8198BF] focus:border-[#8198BF]">
          <option value="未分類">未分類</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <p className="mt-1 mb-2 text-base">文章內容</p>
        <textarea required className="w-full px-3 py-2 mb-2 rounded-md bg-slate-200 h-[50vh] ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF] resize-none" placeholder="Relation between Java and Javascript is like dog and hotdog." />
        <p className="mt-1 mb-2 text-base">題目設定</p>
        <div className="flex items-center w-full h-24 p-2 bg-white rounded">
          <p className="justify-center mt-4 ml-10 text-base font-bold">
            設定題目難易度
            <br />
            (最多共十題問題)
          </p>
          <p className="ml-6 text-base font-bold">簡易:</p>
          <input
            required
            type="number"
            name="easy"
            min="0"
            max="10"
            onChange={(e) => handleInputChange(e, "easy")}
            className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          />
          <p className="ml-6 text-base font-bold">中等:</p>
          <input
            required
            type="number"
            name="middle"
            min="0"
            max="10"
            onChange={(e) => handleInputChange(e, "medium")}
            className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          />
          <p className="ml-6 text-base font-bold">困難:</p>
          <input
            required
            type="number"
            name="hard"
            min="0"
            max="10"
            onChange={(e) => handleInputChange(e, "hard")}
            className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          />
          {errorMessage && <p className="ml-2 text-red-500">{errorMessage}</p>}
        </div>
        <button type="submit" className="block bg-[#8198BF] text-white px-6 py-1 rounded-md mt-4 ml-auto hover:bg-[#638ace]">生成題目</button>
      </form>
    </div>
  );
}

export default Storearticle;
