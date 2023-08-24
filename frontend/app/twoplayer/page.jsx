"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import nookies from "nookies";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Navbar from "../../components/navbar";
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
  const [useCorrectRatio, setUseCorrectRatio] = useState(false);
  const [correctRatio, setCorrectRatio] = useState(1.05);
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
    <>
      <div>
        <button
          type="button"
          onClick={createRoomHandler}
          className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-blue-500 rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-primary"
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
          className="px-4 py-2 text-2xl text-center border max-w-[12rem] rounded-lg"
        />
        <button
          type="submit"
          className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-blue-500 rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-primary"
        >
          加入房間
        </button>
      </form>
    </>
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
      <div className="flex flex-col items-center mt-6">
        <p className="text-2xl">房號</p>
        <p className="mt-3 text-2xl">{roomId}</p>
        <button
          type="button"
          onClick={copyLink}
          className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-blue-500 rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-primary"
        >
          複製房號
        </button>
      </div>
      <button
        type="button"
        onClick={ShareLinkModalToggleHandler}
        className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-blue-500 rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-primary"
      >
        分享連結
      </button>
      {showShareLink && <ShareLink modalToggleHandler={ShareLinkModalToggleHandler} />}
      <button
        type="button"
        className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-blue-500 rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-primary"
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
          useCorrectRatio={useCorrectRatio}
          setUseCorrectRatio={setUseCorrectRatio}
          correctRatio={correctRatio}
          setCorrectRatio={setCorrectRatio}
        />
      )}
      <button
        type="button"
        onClick={startGameHandler}
        disabled={startGame === true}
        className="block px-10 py-3 mt-6 text-xl text-white transition duration-300 ease-in-out delay-150 bg-blue-500 rounded-xl hover:-translate-y-1 hover:scale-110 hover:bg-primary"
      >
        {startGame ? "等待中" : "點擊開始"}
      </button>
      {startGame && <p className="mt-6 text-2xl">正在等待對手...</p>}
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
    if (chooseCorrectAnswer && consecutiveCorrectAnswers && useCorrectRatio) {
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
    <div className="items-center my-4">
      {quiz && quiz?.questions?.length > 0 && (
        <div>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center p-4 mr-4 border rounded-lg">
              <p>你</p>
              <p className="text-3xl">目前分數: {score}</p>
            </div>
            <div className="flex flex-col items-center mt-10">
              <h1 className="mb-4 text-2xl">剩餘時間 : {seconds}</h1>
              <p className="text-2xl">{quiz?.questions?.[questionIndex].question}</p>
              <div className="flex my-4">
                <p className="mr-3 text-xl">難度 :</p>
                <p className="mr-6 text-xl">{quiz?.questions[questionIndex].difficulty}</p>
                <p className="mr-6 text-xl">
                  {questionIndex + 1} / {quiz?.questions.length}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center p-4 ml-4 border rounded-lg">
              <p>對手</p>
              <p className="text-3xl">目前分數: {opponentScore}</p>
            </div>
          </div>
          <div className="flex flex-col items-center mb-10">{OptionsItems}</div>
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
      <Navbar />
      <div className="flex flex-col items-center mt-7">
        <div className="mb-5 text-2xl">雙人對戰</div>
        {testStatus === "setting" && SettingPage}
        {testStatus === "waiting" && WaitingPage}
        {testStatus === "process" && ProcessPage}
        {testStatus === "end" && EndPage}
      </div>
    </>
  );
}

export default App;
