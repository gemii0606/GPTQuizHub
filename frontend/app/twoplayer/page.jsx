"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import nookies from "nookies";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ShareLink from "../../components/ShareLink";
import QuizSetting from "../../components/QuizSetting";

const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET_URL);
function App() {
  const router = useRouter();
  const [quiz, setQuiz] = useState([]);
  const [testStatus, setTestStatus] = useState("setting");
  const [roomId, setRoomId] = useState("");
  const [startGame, setStartGame] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  // process state
  const [seconds, setSeconds] = useState(10);
  const [questionSeconds, setQuestionSeconds] = useState(10);
  const [randomOptions, setRandomOptions] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [correctRatio, setCorrectRatio] = useState(1.0);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [hasClickOption, setHasClickedOption] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [consecutiveCorrectAnswers, setConsecutiveCorrectAnswers] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showSetting, setShowSetting] = useState(false);
  const roomRef = useRef();
  useEffect(() => {
    return () => {
      socket.close();
      socket.disconnect();
    };
  }, []);
  // 對戰過程相關
  useEffect(() => {
    let currentOptions = quiz?.questions?.[questionIndex].options;
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
    if (testStatus !== "setting") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  });
  const moveToNextQuestion = () => {
    if (questionIndex === quiz.questions.length - 1) {
      socket.emit("end", roomId, nookies.get().user_id, score);
      socket.on("end", (data) => {
        console.log(data);
        const filteredData = data.filter((item) => item.user_id !== nookies.get().user_id);
        console.log(filteredData[0].score);
        setOpponentScore(filteredData[0].score);
      });
      setTestStatus("end");
    } else {
      socket.emit("end", roomId, nookies.get().user_id, score);
      socket.on("end", (data) => {
        console.log(data);
        const filteredData = data.filter((item) => item.user_id !== nookies.get().user_id);
        console.log(filteredData[0].score);
        setOpponentScore((prevScore) => prevScore + filteredData[0].score);
      });
      setQuestionIndex((prevIndex) => prevIndex + 1);
      setSeconds(questionSeconds);
      setHasClickedOption(false);
    }
  };
  useEffect(() => {
    if (testStatus === "process") {
      const interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else {
          moveToNextQuestion();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testStatus, seconds]);
  // socket.io
  function createRoomHandler() {
    socket.emit("createroom", nookies.get().user_id);
    socket.on("createroom", (roomName) => {
      console.log(roomName);
      setRoomId(roomName);
    });
    setTestStatus("waiting");
  }
  function joinRoomHandler(joinRoomId) {
    socket.emit("joinroom", joinRoomId, nookies.get().user_id);
    setRoomId(joinRoomId);
    setTestStatus("waiting");
  }
  function startGameHandler() {
    socket.emit("isready", roomId, nookies.get().user_id);
    setStartGame(!startGame);
    socket.on("isready", (data) => {
      console.log(data.data.quiz);
      setQuiz(data.data.quiz);
      setTestStatus("process");
    });
  }
  const SettingPage = (
    <div className="w-[25rem] h-auto m-8 p-8 flex flex-col items-center">
      <Link href="/questionbanks" className="absolute p-2 text-black bg-white border rounded-md right-6 top-2">回到題庫頁面</Link>
      <div className="flex flex-col items-center">
        <div className="mb-5 text-2xl font-semibold text-white">雙人對戰</div>
        <button
          type="button"
          onClick={createRoomHandler}
          className="block py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-black px-14 rounded-xl hover:scale-110 hover:btn3"
        >
          創建房間
        </button>
      </div>
      <form className="flex flex-col mt-5" onSubmit={() => joinRoomHandler(roomRef.current?.value)}>
        <input
          type="text"
          ref={roomRef}
          placeholder="房間號碼"
          required
          className="px-4 py-2 text-2xl text-center border max-w-[12rem] rounded-lg outline-none"
        />
        <button
          type="submit"
          className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-black rounded-xl hover:scale-110 hover:btn3"
        >
          加入房間
        </button>
      </form>
    </div>
  );
  function copyLink() {
    navigator.clipboard.writeText(roomId);
    Swal.fire({
      icon: "success",
      title: "已複製到剪貼簿",
      text: "分享給其他朋友",
      showConfirmButton: false,
      timer: 1000,
    });
  }
  const ShareLinkModalToggleHandler = () => {
    setShowShareLink((prev) => !prev);
    document.body.classList.toggle("modal-open");
  };
  const ShowSettingModalToggleHandler = () => {
    setShowSetting((prev) => !prev);
    document.body.classList.toggle("modal-open");
  };
  const WaitingPage = (
    <div className="flex flex-col items-center mt-5">
      <Link href="/questionbanks" className="absolute p-2 text-black bg-white border rounded-md right-6 top-2">回到題庫頁面</Link>
      <div className="flex flex-col items-center mt-6">
        <p className="text-2xl font-semibold text-white">房號</p>
        <p className="mt-3 text-2xl">{roomId}</p>
        <button
          type="button"
          onClick={copyLink}
          className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-black rounded-xl hover:scale-110 hover:btn3"
        >
          複製房號
        </button>
      </div>
      <button
        type="button"
        onClick={ShareLinkModalToggleHandler}
        className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-black rounded-xl hover:scale-110 hover:btn3"
      >
        分享連結
      </button>
      {showShareLink && <ShareLink modalToggleHandler={ShareLinkModalToggleHandler} />}
      <button
        type="button"
        className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-black rounded-xl hover:scale-110 hover:btn3"
        onClick={ShowSettingModalToggleHandler}
      >
        測驗設定
      </button>
      {showSetting && (
        <QuizSetting
          modalToggleHandler={ShowSettingModalToggleHandler}
          questionSeconds={questionSeconds}
          setQuestionSeconds={setQuestionSeconds}
          randomOptions={randomOptions}
          setRandomOptions={setRandomOptions}
          correctRatio={correctRatio}
          setCorrectRatio={setCorrectRatio}
        />
      )}
      <button
        type="button"
        onClick={startGameHandler}
        disabled={startGame === true}
        className="block px-10 py-3 mt-6 text-xl text-black transition duration-300 ease-in-out delay-150 bg-white rounded-xl hover:scale-110 hover:btn2"
      >
        {startGame ? "等待中" : "點擊開始"}
      </button>
      {startGame && <p className="mt-6 text-2xl font-semibold">正在等待對手...</p>}
    </div>
  );
  const handleOptionClick = (optionId) => {
    setSelectedOptionId(optionId);
    setHasClickedOption(true);
    const selectedOption = shuffledOptions.find((option) => option.id === optionId);
    const chooseCorrectAnswer =
      selectedOption && selectedOption.id === Number(quiz?.questions[questionIndex].correct_answer);
    const elapsedTime = questionSeconds - seconds + 0.5;
    const questionScore = Math.max(Math.round(100 - (100 * elapsedTime) / questionSeconds), 5);
    if (chooseCorrectAnswer) {
      setScore((prevScore) => prevScore + questionScore);
      setConsecutiveCorrectAnswers(true);
    } else {
      setConsecutiveCorrectAnswers(false);
    }
    if (chooseCorrectAnswer && consecutiveCorrectAnswers) {
      setScore((prevScore) => prevScore + Math.round(questionScore * correctRatio));
    }
  };
  const OptionsItems =
    shuffledOptions &&
    shuffledOptions.length > 0 &&
    shuffledOptions.map((option) => {
      const isCorrectAnswer = option.id === Number(quiz?.questions[questionIndex].correct_answer);
      const isSelected = hasClickOption && option.id === selectedOptionId;
      let buttonClassName =
        "block px-8 py-4 text-lg bg-[#4783EA] text-white rounded-xl mt-6 w-3/5 leading-8 hover:bg-[#3c70c9] disabled:hover:bg-slate-400";
      if (isSelected) {
        buttonClassName += isCorrectAnswer ? " bg-green-500" : " bg-red-500";
      } else if (!isSelected && hasClickOption) {
        buttonClassName += " bg-slate-400";
      }
      return (
        <button
          type="button"
          onClick={() => handleOptionClick(option.id)}
          disabled={hasClickOption === true}
          key={option.id}
          className={buttonClassName}
        >
          {option.content}
        </button>
      );
    });
  const ProcessPage = (
    <div className="items-center h-auto p-8 m-8 bg-white rounded-md opacity-70 w-[50rem]">
      {quiz && quiz?.questions?.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center p-4 mr-4 border rounded-lg w-28">
              <p>你</p>
              <p className="text-xl">Score: {score}</p>
            </div>
            <div className="relative flex flex-col items-center mt-10">
              <div className="flex items-center justify-center w-16 h-16 mb-4 border-4 border-black border-dashed rounded-full animate-spin" />
              <p className="absolute text-2xl text-center top-4">{seconds}</p>
              <p className="text-2xl">{quiz?.questions?.[questionIndex].question}</p>
              <div className="flex my-4">
                <p className="mr-3 text-xl">難度 :</p>
                <p className="mr-6 text-xl">{quiz?.questions[questionIndex].difficulty}</p>
                <p className="text-xl">
                  {questionIndex + 1} / {quiz?.questions.length}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center p-4 ml-4 border rounded-lg w-28">
              <p>對手</p>
              <p className="text-xl">Score: {opponentScore}</p>
            </div>
          </div>
          <div className="flex flex-col items-center mb-10 w-[25rem]">{OptionsItems}</div>
        </div>
      )}
    </div>
  );
  function leaveGameHandler() {
    router.push("/");
  }
  const EndPage = (
    <div className="flex flex-col items-center">
      {score > opponentScore && <p className="m-2 text-xl">你贏了</p>}
      {score === opponentScore && <p className="m-2 text-xl">平手</p>}
      {score < opponentScore && <p className="m-2 text-xl">你輸了</p>}
      <p className="m-2 text-xl">你的得分:{score}</p>
      <p className="m-2 text-xl">對手得分: {opponentScore}</p>
      <button
        type="button"
        onClick={leaveGameHandler}
        className="block px-16 py-4 text-2xl mr-8 bg-[#4783EA] text-white rounded-xl mt-20 disabled:opacity-50 hover:bg-[#3c70c9]"
      >
        離開
      </button>
    </div>
  );
  return (
    <>
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-center bg-no-repeat bg-cover bg-fire">
        {testStatus === "setting" && SettingPage}
        {testStatus === "waiting" && WaitingPage}
        {testStatus === "process" && ProcessPage}
        {testStatus === "end" && EndPage}
      </div>
    </>
  );
}

export default App;
