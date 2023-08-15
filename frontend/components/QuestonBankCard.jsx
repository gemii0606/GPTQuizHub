"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Edit from "../public/edit.png";

const MockData = {
  id: 1,
  created_at: "2023-08-13",
  title: "React中的Key概念",
  is_liked: false,
  questions: [
    {
      id: 1,
      difficulty: "簡單",
      content: "React中的key的作用是什麼？",
      options: [
        {
          id: 1,
          content: "協助React辨識元件的位置",
        },
        {
          id: 2,
          content: "控制元件的CSS樣式",
        },
        {
          id: 3,
          content: "定義元件的初始狀態",
        },
        {
          id: 4,
          content: "用於元件的事件處理",
        },
      ],
      correct_answer: 1,
      explanation:
        "key用於協助React辨識元件的位置，從而確定元件的新增、移除或修改，以避免可能出現的錯誤。",
    },
    {
      id: 2,
      difficulty: "普通",
      content: "下列關於key的敘述何者正確？",
      options: [
        {
          id: 1,
          content: "key需要是隨機生成的數值",
        },
        {
          id: 2,
          content: "使用index作為key可以確保元件正確渲染",
        },
        {
          id: 3,
          content: "key需要是獨特唯一的",
        },
        {
          id: 4,
          content: "隨便",
        },
      ],
      correct_answer: 3,
      explanation:
        "正確的key需求是獨特唯一且穩定可預測的，不應使用index作為key，因為可能會導致渲染錯誤。",
    },
  ],
};
const OptionsItems = MockData.questions[0].options.map((option) => (
  <p key={option.id} className="mt-3 font-bold">{`(${option.id}) ${option.content}`}</p>
));

function QuestonBankCard() {
  const [editQuestion, setEditQuestion] = useState(false);
  const [difficulty, setDifficulty] = useState(MockData.questions[0].difficulty);
  const [correctAnswer, setCorrectAnswer] = useState(MockData.questions[0].correct_answer);
  const [loading, setLoading] = useState(false);
  const explanationRef = useRef(null);
  const optionsRefs = useRef([]);
  const router = useRouter();
  function editQuestionHandler() {
    setLoading(true);
    console.log("editQuestion");
    setLoading(false);
    setEditQuestion(false);
  }
  function deleteQuestionHandler() {
    setLoading(true);
    Swal.fire({
      title: "確定刪除?",
      showCancelButton: true,
      confirmButtonText: "確定",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("問題已刪除", "", "success");
      }
      setLoading(false);
      router.push("/questionsbank");
    });
  }
  const QuestionContent = (
    <>
      <div className="flex items-center">
        <p className="mr-3">難度 :</p>
        <p>{MockData.questions[0].difficulty}</p>
      </div>
      {OptionsItems}
      <div className="flex items-center mt-4 mb-4">
        <p className="mr-3 font-bold">正確答案 :</p>
        <p className="font-bold">({MockData.questions[0].correct_answer})</p>
      </div>
      <div className="mb-4">
        <p className="mb-2">說明 :</p>
        <div className="break-words whitespace-pre-wrap">{MockData.questions[0].explanation}</div>
      </div>
    </>
  );
  const OptionsEditItems = MockData.questions[0].options.map((option) => (
    <div className="flex items-center mt-3">
      <p key={option.id} className="mt-3 mr-3 font-bold">
        ({option.id})
      </p>
      <input
        type="text"
        defaultValue={option.content}
        // eslint-disable-next-line no-return-assign, no-undef
        ref={(el) => (optionsRefs.current[index] = el)}
        required
        className="border rounded-md focus:outline-none py-2 px-3.5 min-w-[30rem]"
      />
    </div>
  ));
  const QuestionEditArea = (
    <form method="post" onSubmit={editQuestionHandler}>
      <div className="flex items-center">
        <p className="mr-3">難度 :</p>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          required
          className="px-2 py-1 border rounded-lg"
        >
          <option value="easy" className="rounded-lg">
            Easy
          </option>
          <option value="normal" className="rounded-lg">
            Normal
          </option>
          <option value="hard" className="rounded-lg">
            Hard
          </option>
        </select>
      </div>
      {OptionsEditItems}
      <div className="flex items-center mt-4 mb-4">
        <p className="mr-3 font-bold">正確答案 :</p>
        <select
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          required
          className="px-2 py-1 border rounded-lg"
        >
          <option value="1" className="rounded-lg">
            1
          </option>
          <option value="2" className="rounded-lg">
            2
          </option>
          <option value="3" className="rounded-lg">
            3
          </option>
          <option value="4" className="rounded-lg">
            4
          </option>
        </select>
      </div>
      <div className="mb-4">
        <p className="mb-2">說明 :</p>
        <textarea
          ref={explanationRef}
          defaultValue={MockData.questions[0].explanation || ""}
          required
          className="resize-none min-w-[60rem] min-h-[5.25rem] mt-2.5 p-2 dark:text-black bg-[#F0F2F5] border border-neutral-400 rounded-[0.625rem] focus:outline-none"
        />
      </div>
      <div>
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="text-base font-bold text-white bg-[#8198BF] font-outfit py-2.5 bg-berry-blue px-[1.875rem] rounded-md mr-[1.125rem] disabled:opacity-50"
          >
            確認
          </button>
          <button
            type="button"
            onClick={() => {
              setEditQuestion(false);
            }}
            className="text-base font-bold text-white font-outfit py-2.5 bg-neutral-300 px-[1.875rem] rounded-md"
          >
            取消
          </button>
        </div>
      </div>
    </form>
  );
  // TODO:到時候key要設定
  return (
    <div className="bg-white border p-5 max-w-[70rem] rounded-lg relative" key={1}>
      <div className="flex mb-4">
        <p className="mr-3">第一題</p>
        <h1>{MockData.questions[0].content}</h1>
        <button
          type="button"
          onClick={() => {
            setEditQuestion(() => !editQuestion);
          }}
        >
          <Image
            src={Edit}
            alt="edit-icon"
            width={20}
            height={20}
            className="absolute cursor-pointer top-3 right-3"
          />
        </button>
      </div>
      {editQuestion ? QuestionEditArea : QuestionContent}
      <button
        type="button"
        onClick={deleteQuestionHandler}
        disabled={loading}
        className="absolute bottom-3 right-3 text-base font-bold mt-4 text-white bg-[#8198BF] py-2.5 px-4 rounded-md disabled:opacity-50"
      >
        刪除題目
      </button>
    </div>
  );
}

export default QuestonBankCard;
