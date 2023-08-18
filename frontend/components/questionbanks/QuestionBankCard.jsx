import { useState } from "react";
import Link from "next/link";

function QuestionsBanksCard({ questionsBank }) {
  const [showQuizType, setShowQuizType] = useState(false);
  return (
    <div
      key={questionsBank.id}
      className="flex items-center justify-between px-4 py-2 mb-3 border rounded-lg"
    >
      <div>
        <p className="max-w-6xl mr-3 text-2xl font-bold leading-6 truncate">
          {questionsBank.title}
        </p>
      </div>
      <div className="flex items-center">
        <div className="block text-base font-bold text-white bg-[#8198BF] py-2.5 px-4 rounded-md hover:opacity-50 mr-5">
          <Link
            href={`/questionbanks/${questionsBank.id}`}
            className="flex items-center cursor-pointer"
          >
            複習
          </Link>
        </div>
        <div>
          <button
            type="button"
            className="relative text-base font-bold text-white bg-[#25B857] py-2.5 px-4 rounded-md hover:opacity-50"
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
      </div>
    </div>
  );
}

export default QuestionsBanksCard;
