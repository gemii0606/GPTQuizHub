import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { mutate } from "swr";
import useDeleteQuiz from "../../hooks/useDeleteQuiz";

function QuestionsBanksCard({ questionsBank }) {
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const showTypeButtonRef = useRef(null);
  const deleteQuiz = useDeleteQuiz(questionsBank.id);
  function deleteQuestionBankHandler() {
    Swal.fire({
      title: "確定刪除?",
      text: "你無法找回此題庫",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "確定刪除",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteQuiz();
        mutate([`${process.env.NEXT_PUBLIC_API_URL}/quizzes/search/`]);
      }
    });
  }
  return (
    <div key={questionsBank.id} className="flex items-center justify-between h-20 px-4 mb-3 border-b">
      <div>
        <p className="max-w-xl mr-6 text-lg font-bold leading-6 truncate">{questionsBank.title}</p>
      </div>
      {questionsBank.status === "pending" && (
        <div className="flex items-center py-2">
          <div className="flex items-center p-1 rounded bg-[#fec681]">
            <p className="ml-1 mr-2 text-base font-semibold text-white">生成中</p>
            <Image src="/loading.png" alt="loading" width={30} height={30} className="animate-spin" />
          </div>
          <button type="button" onClick={deleteQuestionBankHandler} ref={showTypeButtonRef}>
            <Image
              src={isDeleteHovered ? "/delete-open.jpg" : "/delete.jpg"}
              alt="delete-icon"
              width={30}
              height={30}
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
              className="mx-2"
            />
          </button>
        </div>
      )}
      {questionsBank.status === "failed" && (
        <div className="flex items-center py-2">
          <div className="flex items-center p-2 bg-red-400 rounded">
            <p className="ml-1 mr-1 text-base font-semibold text-white">生成錯誤！</p>
          </div>
          <button type="button" onClick={deleteQuestionBankHandler} ref={showTypeButtonRef}>
            <Image
              src={isDeleteHovered ? "/delete-open.jpg" : "/delete.jpg"}
              alt="delete-icon"
              width={30}
              height={30}
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
              className="mx-2"
            />
          </button>
        </div>
      )}
      {questionsBank.status === "ok" && (
        <div className="flex items-center">
          <div className="block text-base font-bold text-white bg-[#8198BF] py-2.5 px-4 rounded-md hover:opacity-50 mr-5">
            <Link href={`/questionbanks/${questionsBank.id}`} className="flex items-center cursor-pointer">
              複習
            </Link>
          </div>
          <div>
            <Link
              href={`/quiz/${questionsBank.id}`}
              className="block text-base font-bold text-white bg-primary py-2.5 px-4 rounded-md hover:opacity-50 mr-2"
            >
              單人測驗
            </Link>
          </div>
          <button type="button" onClick={deleteQuestionBankHandler} ref={showTypeButtonRef}>
            <Image
              src={isDeleteHovered ? "/delete-open.jpg" : "/delete.jpg"}
              alt="delete-icon"
              width={30}
              height={30}
              onMouseEnter={() => setIsDeleteHovered(true)}
              onMouseLeave={() => setIsDeleteHovered(false)}
            />
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionsBanksCard;
