"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import axios from "axios";
import nookies from "nookies";
import QuizSetting from "../../../components/QuizSetting";

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
      explanation: "key用於協助React辨識元件的位置，從而確定元件的新增、移除或修改，以避免可能出現的錯誤。",
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
      explanation: "正確的key需求是獨特唯一且穩定可預測的，不應使用index作為key，因為可能會導致渲染錯誤。",
    },
    {
      id: 3,
      difficulty: "普通",
      content: "題目3",
      options: [
        {
          id: 1,
          content: "1",
        },
        {
          id: 2,
          content: "2",
        },
        {
          id: 3,
          content: "3",
        },
        {
          id: 4,
          content: "隨便",
        },
      ],
      correct_answer: 3,
      explanation: "正確的key需求是獨特唯一且穩定可預測的，不應使用index作為key，因為可能會導致渲染錯誤。",
    },
  ],
};
// TODO:隨機題目排序
// TODO:根據題目數量選擇相對應的題數
function Page({ params }) {
  const [quizStatus, setQuizStatus] = useState("start");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(10);
  const [seconds, setSeconds] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [randomOptions, setRandomOptions] = useState(false);
  const [randomOrder, setRandomOrder] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(MockData.questions.length);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [wrongAnswer, setWrongAnswer] = useState([]);
  const [unansweredQuestion, setUnansweredQuestion] = useState([]);
  const router = useRouter();
  const correctAnswers = MockData.questions.length - wrongAnswer.length;
  const accuracy = (correctAnswers / MockData.questions.length) * 100;
  useEffect(() => {
    setShuffledOptions(
      randomOptions
        ? [...MockData.questions[questionIndex].options].sort(() => Math.random() - 0.5)
        : [...MockData.questions[questionIndex].options]
    );
  }, [questionIndex, randomOptions]);
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    if (quizStatus === "process") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });
  async function quizSubmitHandler() {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/history/create`,
        {
          quiz_id: params.quiz_id,
          accuracy,
          wrongAnswer,
        },
        { headers: { Authorization: `Bearer ${nookies.get().access_token}` } }
      );
      console.log(response);
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "測驗紀錄已上傳",
        timerProgressBar: true,
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Server Error",
          text: "請稍後再試或和我們的技術團隊聯絡",
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "測驗紀錄上傳失敗",
          text: `${error}`,
          timerProgressBar: true,
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
  }
  const moveToNextQuestion = () => {
    if (questionIndex === MockData.questions.length - 1) {
      quizSubmitHandler();
      setQuizStatus("end");
    } else {
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setSeconds(questionSeconds);
    }
  };
  const handleTimeUp = async () => {
    Swal.fire({
      icon: "warning",
      title: "時間到",
      showConfirmButton: false,
      timer: 1000,
    }).then(() => {
      setUnansweredQuestion((prevUnansweredQuestion) => [...prevUnansweredQuestion, questionIndex]);
      setWrongAnswer((prevWrongAnswer) => [...prevWrongAnswer, questionIndex]);
      moveToNextQuestion();
    });
  };
  useEffect(() => {
    if (quizStatus === "process" && seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    if (quizStatus === "process" && seconds === 0) {
      handleTimeUp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStatus, seconds]);
  const ModalToggleHandler = () => {
    setShowSetting((prev) => !prev);
    document.body.classList.toggle("modal-open");
  };
  const StartPage = (
    <div className="border border-black rounded-xl min-w-[60rem] min-h-[60rem] items-center">
      <p className="text-center mt-[8rem] font-extrabold text-4xl">{MockData.title}</p>
      <div className="flex flex-col items-center mt-24">
        <button
          type="button"
          className="block px-24 py-4 text-4xl bg-[#8198BF] text-white rounded-xl mb-20"
          onClick={ModalToggleHandler}
        >
          測驗設定
        </button>
        {showSetting && (
          <QuizSetting
            modalToggleHandler={ModalToggleHandler}
            questionNumber={questionNumber}
            setQuestionNumber={setQuestionNumber}
            setQuestionSeconds={setQuestionSeconds}
            questionSeconds={questionSeconds}
            randomOptions={randomOptions}
            setRandomOptions={setRandomOptions}
            randomOrder={randomOrder}
            setRandomOrder={setRandomOrder}
          />
        )}
        <button
          type="button"
          onClick={() => {
            setQuizStatus("process");
            setSeconds(questionSeconds);
          }}
          className="block px-24 py-4 text-4xl bg-[#4783EA] text-white rounded-xl mb-20"
        >
          開始測驗
        </button>
        <button
          type="button"
          onClick={() => {
            router.push("/questionbanks");
          }}
          className="block px-24 py-4 text-4xl bg-[#8198BF] text-white rounded-xl mb-20"
        >
          回到題庫
        </button>
      </div>
    </div>
  );
  const handleOptionClick = (optionId) => {
    const selectedOption = shuffledOptions.find((option) => option.id === optionId);
    if (selectedOption && selectedOption.id === MockData.questions[questionIndex].correct_answer) {
      Swal.fire({
        icon: "success",
        title: "答對了",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        moveToNextQuestion();
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "答錯了",
        showConfirmButton: false,
        timer: 1000,
      }).then(() => {
        setWrongAnswer((prevWrongAnswer) => [...prevWrongAnswer, questionIndex + 1]);
        moveToNextQuestion();
      });
    }
  };
  const OptionsItems = shuffledOptions.map((option) => (
    <button
      type="button"
      onClick={() => handleOptionClick(option.id)}
      key={option.id}
      className="block px-24 py-4 text-2xl bg-[#4783EA] text-white rounded-xl mt-20 w-[45rem] leading-8"
    >
      {option.content}
    </button>
  ));
  const ProcessPage = (
    <div className="border border-black rounded-xl min-w-[60rem] min-h-[60rem] items-center">
      {MockData.questions.length > 0 && (
        <div>
          <div className="flex flex-col items-center mt-10">
            <h1 className="mb-4 text-4xl">剩餘時間 : {seconds}</h1>
            <p className="text-4xl">{MockData.questions[questionIndex].content}</p>
            <div className="flex my-4">
              <p className="mr-3 text-3xl">難度 :</p>
              <p className="mr-6 text-3xl">{MockData.questions[questionIndex].difficulty}</p>
              <p className="text-3xl">
                {questionIndex + 1} / {MockData.questions.length}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center mb-10">{OptionsItems}</div>
        </div>
      )}
    </div>
  );
  const EndPage = (
    <div className="flex flex-col border border-black rounded-xl min-w-[60rem] min-h-[60rem] items-center">
      <div className="mt-[8rem]">
        {accuracy === 100 && <p className="text-4xl">滿分，你超強</p>}
        {accuracy > 60 && accuracy < 100 && <p className="text-4xl">還不錯</p>}
        {accuracy < 60 && <p className="text-4xl">你超爛</p>}
        <p className="text-4xl">答對率 : {accuracy.toFixed(2)}%</p>
        <p className="text-4xl">總題數 : {MockData.questions.length}</p>
        <p className="text-4xl">未答題數 : {unansweredQuestion.length}</p>
        <p className="text-4xl">正確題數 : {correctAnswers}</p>
        <p className="text-4xl">錯誤題數 : {wrongAnswer.length}</p>
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            setUnansweredQuestion([]);
            setWrongAnswer([]);
            setQuizStatus("start");
            setSeconds(10);
            setQuestionIndex(0);
            setLoading(false);
          }}
          className="block px-24 py-4 text-4xl mr-8 bg-[#4783EA] text-white rounded-xl mt-20 disabled:opacity-50"
        >
          重新測驗
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            router.push("/questionbanks");
            setLoading(false);
          }}
          className="block px-24 py-4 text-4xl bg-[#4783EA] text-white rounded-xl mt-20 disabled:opacity-50"
        >
          回到題庫
        </button>
      </div>
    </div>
  );
  return (
    <div className="flex justify-center mt-[5rem]">
      {quizStatus === "start" && StartPage}
      {quizStatus === "process" && ProcessPage}
      {quizStatus === "end" && EndPage}
    </div>
  );
}

export default Page;
