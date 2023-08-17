"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import Link from "next/link";
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

function QuestonBankCard() {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [editQuestion, setEditQuestion] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const explanationRef = useRef(null);
  function editQuestionHandler() {
    setLoading(true);
    Swal.fire("題目已修改", "", "success");
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
        Swal.fire("題目已刪除", "", "success");
        setQuestionIndex(questionIndex - 1);
        if (questionIndex === 0) {
          setQuestionIndex(questionIndex + 1);
        }
      }
      setEditQuestion(false);
      setLoading(false);
    });
  }
  const OptionsItems = MockData.questions[questionIndex].options.map((option) => (
    <p key={option.id} className="mt-3 text-2xl font-bold">{`(${option.id}) ${option.content}`}</p>
  ));
  const QuestionContent = (
    <>
      <h1 className="mb-5 text-2xl font-bold rounded-lg">
        {MockData.questions[questionIndex].content}
      </h1>
      <div className="flex items-center">
        <p className="mr-3">難度 :</p>
        <p>{MockData.questions[questionIndex].difficulty}</p>
      </div>
      {OptionsItems}
      <div className="flex items-center mt-4 mb-4">
        <p className="mr-3 font-bold">正確答案 :</p>
        {showAnswer && (
          <p className="font-bold">({MockData.questions[questionIndex].correct_answer})</p>
        )}
        <button
          type="button"
          onClick={() => {
            setShowAnswer(!showAnswer);
          }}
          className="text-base font-bold ml-8 text-white bg-[#8198BF] py-2.5 px-4 rounded-md disabled:opacity-50"
        >
          {showAnswer ? "隱藏" : "顯示"}
        </button>
      </div>
      <div className="mb-4">
        <p className="mb-2">說明 :</p>
        <div className="break-words whitespace-pre-wrap">
          {MockData.questions[questionIndex].explanation}
        </div>
      </div>
    </>
  );
  const OptionsEditItems = MockData.questions[questionIndex].options.map((option) => (
    <div className="flex items-center mt-3" key={option.id}>
      <p key={option.id} className="mt-3 mr-3 text-2xl font-bold">
        ({option.id})
      </p>
      <input
        type="text"
        defaultValue={option.content}
        required
        className="border rounded-md focus:outline-none py-2 px-3.5 min-w-[30rem] text-2xl font-bold"
      />
    </div>
  ));
  const QuestionEditArea = (
    <form method="post" onSubmit={editQuestionHandler}>
      <input
        type="text"
        defaultValue={MockData.questions[questionIndex].content}
        className="min-w-[30rem] border px-4 py-3 text-2xl font-bold rounded-lg mb-5"
      />
      <div className="flex items-center">
        <p className="mr-3">難度 :</p>
        <select
          defaultValue={MockData.questions[questionIndex].difficulty}
          required
          className="px-2 py-1 border rounded-lg"
        >
          <option value="easy" className="rounded-lg">
            簡單
          </option>
          <option value="normal" className="rounded-lg">
            普通
          </option>
          <option value="hard" className="rounded-lg">
            困難
          </option>
        </select>
      </div>
      {OptionsEditItems}
      <div className="flex items-center mt-4 mb-4">
        <p className="mr-3 font-bold">正確答案 :</p>
        <select
          defaultValue={MockData.questions[questionIndex].correct_answer}
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
          defaultValue={MockData.questions[questionIndex].explanation || ""}
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
    <div className="bg-white border p-5 min-w-[80rem] rounded-lg relative" key={1}>
      <div className="flex mb-4">
        <p className="mr-3">{`第${questionIndex + 1}題`}</p>
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
      <div className="mt-6">
        <button
          type="button"
          disabled={questionIndex === 0}
          onClick={() => {
            setQuestionIndex(questionIndex - 1);
          }}
          hidden={editQuestion}
          className="text-base font-bold mr-6 text-white bg-[#8198BF] py-2.5 px-4 rounded-md disabled:opacity-50"
        >
          上一題
        </button>
        <button
          type="button"
          disabled={questionIndex === MockData.questions.length - 1}
          onClick={() => {
            setQuestionIndex(questionIndex + 1);
          }}
          hidden={editQuestion}
          className="text-base font-bold mr-6 text-white bg-[#8198BF] py-2.5 px-4 rounded-md disabled:opacity-50"
        >
          下一題
        </button>
        {questionIndex === MockData.questions.length - 1 && (
          <Link
            href="/questionsbanks"
            hidden={editQuestion}
            className="text-base font-bold text-white bg-[#8198BF] py-2.5 px-4 rounded-md disabled:opacity-50"
          >
            回到題庫
          </Link>
        )}
      </div>
    </div>
  );
}

export default QuestonBankCard;
