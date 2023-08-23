"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import axios from "axios";
import nookies from "nookies";
import QuizSetting from "../../../components/QuizSetting";
import useQuiz from "../../../hooks/useQuiz";

function Page({ params }) {
  const { quiz, isLoading } = useQuiz(params.quiz_id);
  const [quizStatus, setQuizStatus] = useState("start");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(10);
  const [seconds, setSeconds] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [randomOptions, setRandomOptions] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [wrongAnswer, setWrongAnswer] = useState([]);
  const [unansweredQuestion, setUnansweredQuestion] = useState([]);
  const router = useRouter();
  useEffect(() => {
    let currentOptions = quiz?.questions?.[questionIndex]?.options;
    if (randomOptions) {
      currentOptions = [...currentOptions].sort(() => Math.random() - 0.5);
    }
    setShuffledOptions(currentOptions);
  }, [questionIndex, randomOptions, quiz]);
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
  const correctAnswers = quiz?.questions?.length - wrongAnswer.length;
  const accuracy = (correctAnswers / quiz?.questions?.length) * 100;
  async function quizSubmitHandler() {
    console.log({
      quiz_id: params.quiz_id,
      accuracy,
      wrongAnswer,
    });
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/history`,
        {
          quiz_id: params.quiz_id,
          accuracy,
          wrongAnswer,
        },
        {
          headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        }
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
    if (questionIndex === quiz.questions.length - 1) {
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
    if (quizStatus === "process" && seconds === 0) {
      handleTimeUp();
    }
    if (quizStatus === "process") {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStatus, seconds, questionIndex]);
  const ModalToggleHandler = () => {
    setShowSetting((prev) => !prev);
    document.body.classList.toggle("modal-open");
  };
  const StartPage = (
    <div className="items-center justify-center rounded-xl h-3/5">
      <p className="text-center mt-[2rem] font-extrabold text-4xl text-primary">GPTQuizHub</p>
      <div className="flex justify-center">
        <p className="mt-[4rem] font-extrabold text-xl w-4/5">{quiz?.title}</p>
      </div>
      <div className="flex flex-col items-center mt-4">
        <button
          type="button"
          className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-blue-500 rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-primary"
          onClick={ModalToggleHandler}
        >
          測驗設定
        </button>
        {showSetting && (
          <QuizSetting
            modalToggleHandler={ModalToggleHandler}
            setQuestionSeconds={setQuestionSeconds}
            questionSeconds={questionSeconds}
            randomOptions={randomOptions}
            setRandomOptions={setRandomOptions}
          />
        )}
        <button
          type="button"
          onClick={() => {
            setQuizStatus("process");
            setSeconds(questionSeconds);
          }}
          className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-blue-500 rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-primary"
        >
          開始測驗
        </button>
        <button
          type="button"
          onClick={() => {
            router.push("/questionbanks");
          }}
          className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-blue-500 rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-primary"
        >
          回到題庫
        </button>
      </div>
    </div>
  );
  const handleOptionClick = (optionId) => {
    const selectedOption = shuffledOptions.find((option) => option.id === optionId);
    if (selectedOption.id === Number(quiz.questions[questionIndex].correct_answer)) {
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
  const OptionsItems =
    shuffledOptions &&
    shuffledOptions.length > 0 &&
    shuffledOptions.map((option) => (
      <button
        type="button"
        onClick={() => handleOptionClick(option.id)}
        key={option.id}
        className="block px-8 py-4 text-lg bg-[#4783EA] text-white rounded-xl mt-6 w-3/5 leading-8 hover:bg-[#3c70c9]"
      >
        {option.content}
      </button>
    ));
  const ProcessPage = (
    <div className="items-center my-4">
      {quiz && quiz?.questions?.length > 0 && (
        <div>
          <div className="flex flex-col items-center mt-4">
            <div className="flex">
              <p className="h-auto text-2xl w-7/8">{quiz?.questions?.[questionIndex].question}</p>
              <h1 className="w-4 mb-4 ml-6 text-2xl">{seconds}</h1>
              <p className="mb-4 ml-6 text-2xl ">seconds</p>
            </div>
            <div className="flex my-4">
              <p className="mr-3 text-xl">難度 :</p>
              <p className="mr-6 text-xl">{quiz?.questions?.[questionIndex].difficulty}</p>
              <p className="text-lg">
                {questionIndex + 1} of {quiz?.questions?.length}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center mb-10">{OptionsItems}</div>
        </div>
      )}
    </div>
  );
  const EndPage = (
    <div className="flex flex-col items-center">
      <div className="mt-[4rem]">
        {accuracy === 100 && (
          <div>
            <div className="flex justify-center border-b-4 border-slate-300 w-[16rem]">
              <p className="mb-2 text-4xl">Bravo!</p>
            </div>
            <Image src="/bravo.gif" alt="bravo" width={200} height={200} className="absolute right-20" />
          </div>
        )}
        {accuracy > 60 && accuracy < 100 && (
          <div>
            <div className="flex justify-center border-b-4 border-slate-300 w-[16rem]">
              <p className="mb-2 text-4xl">Sweet~</p>
            </div>
            <Image src="/sweet.gif" alt="bravo" width={200} height={200} className="absolute right-20" />
          </div>
        )}
        {accuracy < 60 && (
          <div>
            <div className="flex justify-center border-b-4 border-slate-300 w-[16rem]">
              <p className="mb-2 text-4xl">Keep Going...</p>
            </div>
            <Image src="/keepgoing.gif" alt="bravo" width={200} height={200} className="absolute right-20" />
          </div>
        )}
        <div className="flex flex-col items-center mt-2">
          <p className="m-2 text-xl">答對率 : {accuracy.toFixed(2)}%</p>
          <p className="m-2 text-xl">總題數 : {quiz?.questions?.length}</p>
          <p className="m-2 text-xl">未答題數 : {unansweredQuestion.length}</p>
          <p className="m-2 text-xl">正確題數 : {correctAnswers}</p>
          <p className="m-2 text-xl">錯誤題數 : {wrongAnswer.length}</p>
        </div>
      </div>
      <div className="flex">
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
          className="block px-16 py-4 text-2xl mr-8 bg-[#4783EA] text-white rounded-xl mt-20 disabled:opacity-50 hover:bg-[#3c70c9]"
        >
          再來一次
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            router.push("/questionbanks");
            setLoading(false);
          }}
          className="block px-16 py-4 text-2xl bg-[#4783EA] text-white rounded-xl mt-20 disabled:opacity-50 hover:bg-[#3c70c9]"
        >
          回到題庫
        </button>
      </div>
    </div>
  );
  return (
    <div className="flex justify-center min-h-screen bg-white">
      {isLoading && <p>正在載入測驗資料...</p>}
      {!isLoading && quizStatus === "start" && StartPage}
      {!isLoading && quizStatus === "process" && ProcessPage}
      {!isLoading && quizStatus === "end" && EndPage}
    </div>
  );
}

export default Page;
