"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const MockData = {
  id: 1,
  created_at: "2023-08-13",
  title: "React中的Key概念",
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
function Page() {
  const [quizStatus, setQuizStatus] = useState("start");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [seconds, setSeconds] = useState(10);
  const router = useRouter();
  const [shuffledOptions, setShuffledOptions] = useState([]);
  useEffect(() => {
    setShuffledOptions(
      [...MockData.questions[questionIndex].options].sort(() => Math.random() - 0.5)
    );
  }, [questionIndex]);
  const moveToNextQuestion = () => {
    if (questionIndex === MockData.questions.length - 1) {
      setQuizStatus("end");
    } else {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setSeconds(10);
    }
  };
  const handleTimeUp = () => {
    const unansweredQuestions = JSON.parse(localStorage.getItem("unansweredQuestions")) || [];
    if (!unansweredQuestions.includes(questionIndex)) {
      unansweredQuestions.push(questionIndex);
      localStorage.setItem("unansweredQuestions", JSON.stringify(unansweredQuestions));
    }
    const wrongAnswers = JSON.parse(localStorage.getItem("wrongAnswers")) || [];
    if (!wrongAnswers.includes(questionIndex)) {
      wrongAnswers.push(questionIndex);
      localStorage.setItem("wrongAnswers", JSON.stringify(wrongAnswers));
    }
    moveToNextQuestion();
  };

  useEffect(() => {
    if (quizStatus === "process") {
      const interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else {
          handleTimeUp();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStatus, seconds]);

  const StartPage = (
    <div className="flex justify-center mt-[10rem] ">
      <div className="border border-black rounded-xl min-w-[60rem] min-h-[40rem] items-center">
        <p className="text-center mt-[8rem] font-extrabold text-4xl">{MockData.title}</p>
        <div className="flex flex-col items-center mt-24">
          <button
            type="button"
            className="block px-24 py-4 text-4xl bg-[#8198BF] text-white rounded-xl"
          >
            測驗設定
          </button>
          <button
            type="button"
            onClick={() => {
              setQuizStatus("process");
            }}
            className="block px-24 py-4 text-4xl bg-[#4783EA] text-white rounded-xl mt-20"
          >
            開始測驗
          </button>
        </div>
      </div>
    </div>
  );
  const handleOptionClick = (optionId) => {
    const selectedOption = MockData.questions[questionIndex].options.find(
      (option) => option.id === optionId
    );
    if (selectedOption && selectedOption.id === MockData.questions[questionIndex].correct_answer) {
      Swal.fire({
        icon: "success",
        title: "答對了",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      const wrongAnswers = JSON.parse(localStorage.getItem("wrongAnswers")) || [];
      if (!wrongAnswers.includes(questionIndex)) {
        wrongAnswers.push(questionIndex);
        localStorage.setItem("wrongAnswers", JSON.stringify(wrongAnswers));
      }
      Swal.fire({
        icon: "error",
        title: "答錯了",
        showConfirmButton: false,
        timer: 1000,
      });
    }
    if (questionIndex === MockData.questions.length - 1) {
      setQuizStatus("end");
    } else {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setSeconds(10);
    }
  };
  const OptionsItems = shuffledOptions.map((option) => (
    <button
      type="button"
      onClick={() => handleOptionClick(option.id)}
      key={option.id}
      className="block px-24 py-4 text-4xl bg-[#4783EA] text-white rounded-xl mt-20"
    >
      {option.content}
    </button>
  ));
  const ProcessPage = (
    <div className="flex flex-col justify-center mt-[10rem]">
      <div className="border border-black rounded-xl min-w-[60rem] min-h-[40rem] items-center">
        <div>
          <h1 className="text-4xl">剩餘時間:{seconds}</h1>
          <div className="flex">
            <p>{MockData.questions[questionIndex].content}</p>
            <p>{MockData.questions[questionIndex].difficulty}</p>
          </div>
        </div>
        <div>
          <p>{questionIndex}</p>
          <p>{MockData.questions.length}</p>
        </div>
        <div className="flex flex-col items-center">{OptionsItems}</div>
      </div>
    </div>
  );
  const unansweredCount = () => {
    const unanswered = JSON.parse(localStorage.getItem("unansweredQuestions")) || [];
    return unanswered.length;
  };
  const WrongAnswersCount = () => {
    const wrongAnswers = JSON.parse(localStorage.getItem("wrongAnswers")) || [];
    return wrongAnswers.length;
  };
  const correctAnswers = MockData.questions.length - WrongAnswersCount();
  const calculateAccuracy = () => {
    return (correctAnswers / MockData.questions.length) * 100;
  };
  const EndPage = (
    <div className="flex mt-24">
      <div>
        <p />
        <p>答對率 : {calculateAccuracy()}%</p>
        <p>總題數 :{MockData.questions.length}</p>
        <p>未答題數 : {unansweredCount()}</p>
        <p>錯誤題數: {WrongAnswersCount()}</p>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("wrongAnswers");
            setQuizStatus("start");
            setSeconds(10);
            setQuestionIndex(0);
          }}
          className="block px-24 py-4 text-4xl mr-8 bg-[#4783EA] text-white rounded-xl mt-20"
        >
          重新測驗
        </button>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem("wrongAnswers");
            router.push("/questionsbanks");
          }}
          className="block px-24 py-4 text-4xl bg-[#4783EA] text-white rounded-xl mt-20"
        >
          回到題庫
        </button>
      </div>
    </div>
  );
  return (
    <div>
      {quizStatus === "start" && StartPage}
      {quizStatus === "process" && ProcessPage}
      {quizStatus === "end" && EndPage}
    </div>
  );
}

export default Page;
