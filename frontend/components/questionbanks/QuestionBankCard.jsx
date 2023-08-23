import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { mutate } from "swr";
import DeleteIcon from "../../public/delete.png";
import useDeleteQuiz from "../../hooks/useDeleteQuiz";

function QuestionsBanksCard({ questionsBank }) {
  const [showQuizType, setShowQuizType] = useState(false);
  const showTypeButtonRef = useRef(null);
  const deleteQuiz = useDeleteQuiz(questionsBank.id);
  const handleOutsideClick = (e) => {
    const clickedElement = e.target;
    if (showTypeButtonRef.current && !showTypeButtonRef.current.contains(clickedElement)) {
      setShowQuizType(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });
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
    <div key={questionsBank.id} className="flex items-center justify-between px-4 py-2 mb-3 border rounded-lg">
      <div>
        <p className="max-w-6xl mr-6 text-2xl font-bold leading-6 truncate">{questionsBank.title}</p>
      </div>
      {questionsBank.status === "pending" && (
        <div className="flex items-center py-2">
          <p className="mr-3 text-xl">生成題目中，請稍後再試</p>
          <button type="button" onClick={deleteQuestionBankHandler} ref={showTypeButtonRef}>
            <Image src={DeleteIcon} alt="delete-icon" width={30} height={30} />
          </button>
        </div>
      )}
      {questionsBank.status === "failed" && (
        <div className="flex items-center py-2">
          <p className="mr-3 text-xl">生成題目錯誤</p>
          <button type="button" onClick={deleteQuestionBankHandler} ref={showTypeButtonRef}>
            <Image src={DeleteIcon} alt="delete-icon" width={30} height={30} />
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
            <button
              type="button"
              className="relative text-base font-bold text-white bg-[#25B857] py-2.5 px-4 rounded-md hover:opacity-50 mr-5"
              onClick={() => setShowQuizType(!showQuizType)}
            >
              測驗形式
            </button>
            {showQuizType && (
              <div className="absolute z-10 bg-white border rounded-lg">
                <Link
                  href={`/quiz/${questionsBank.id}`}
                  className="block text-base font-bold py-2.5 px-4 rounded-md hover:opacity-50 border-b"
                >
                  單人測驗
                </Link>
                <Link
                  href={`/twoplayer/${questionsBank.id}`}
                  className="block text-base font-bold py-2.5 px-4 rounded-md hover:opacity-50 border-b"
                >
                  雙人測驗
                </Link>
                <Link
                  href={`/multiplayer/${questionsBank.id}`}
                  className="block text-base font-bol py-2.5 px-4 rounded-md hover:opacity-50"
                >
                  多人測驗
                </Link>
              </div>
            )}
          </div>
          <button type="button" onClick={deleteQuestionBankHandler} ref={showTypeButtonRef}>
            <Image src={DeleteIcon} alt="delete-icon" width={30} height={30} />
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionsBanksCard;
