"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import nookies from "nookies";
import Navbar from "../../components/navbar";

const socket = io.connect(process.env.NEXT_PUBLIC_SOCKET_URL);
function App() {
  const [testStatus, setTestStatus] = useState("setting");
  const [startGame, setStartGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const roomRef = useRef();
  useEffect(() => {
    socket.on("test from backend", () => {
      console.log("Received message from backend");
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  function createRoomHandler() {
    socket.emit("createroom", () => {
      console.log(nookies.get().user_id);
    });
    setTestStatus("waiting");
  }
  function joinRoomHandler() {
    socket.emit("joinroom", () => {
      console.log("joinroom");
    });
    socket.on("joinroom", () => {});
    setTestStatus("waiting");
  }
  function startGameHandler() {
    setLoading(true);
    socket.emit("isReady", () => {
      console.log("isReady");
    });
    setStartGame(!startGame);
    setLoading(false);
  }
  socket.on("isReady");
  const SettingPage = (
    <>
      <div>
        <button type="button" onClick={createRoomHandler} className="p-4 mr-3 text-lg border border-black rounded-lg">
          創建房間
        </button>
      </div>
      <form className="flex flex-col mt-4" onSubmit={joinRoomHandler}>
        <input
          type="text"
          ref={roomRef}
          placeholder="房間號碼"
          required
          className="px-4 py-2 text-4xl text-center border max-w-[22.5rem]"
        />
        <button type="submit" className="bg-[#8198BF] text-white px-20 py-4 text-4xl rounded-xl mt-3">
          加入房間
        </button>
      </form>
    </>
  );
  const WaitingPage = (
    <div className="mt-5">
      <button
        type="button"
        onClick={startGameHandler}
        disabled={loading === true}
        className="block px-24 py-4 mb-20 text-4xl text-white rounded-xl bg-primary"
      >
        {startGame ? "取消" : "點擊開始"}
      </button>
      {startGame && <p className="mb-3 text-4xl">正在等待對手...</p>}
    </div>
  );
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-7">
        <div className="mb-5 text-lg">雙人對戰</div>
        {testStatus === "setting" && SettingPage}
        {testStatus === "waiting" && WaitingPage}
        {/* {testStatus === "start" && StartPage} */}
      </div>
    </>
  );
}

export default App;
