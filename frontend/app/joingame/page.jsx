"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import Navbar from "../../components/navbar";

function Page() {
  const router = useRouter();
  const gameTypeRef = useRef();
  const roomRef = useRef();
  function gameSubmitHandler(e) {
    e.preventDefault();
    router.push(`/${gameTypeRef.current.value}/${roomRef.current.value}`);
  }
  return (
    <div>
      {nookies.get().access_token && <Navbar />}
      <div className="flex justify-center mt-[5rem]">
        <form
          onSubmit={gameSubmitHandler}
          className="flex flex-col border border-black rounded-xl min-w-[30rem] min-h-[30rem] items-center justify-center"
        >
          <p className="mb-6 text-6xl font-pattaya text-[#8198BF] font-normal mt-16">GPTQuizHub</p>
          <p>此功能目前還沒用</p>
          <div className="my-5">
            <select className="px-4 py-3 text-4xl border border-black rounded-lg" ref={gameTypeRef}>
              <option value="twoplayer" className="text-4xl">
                雙人對戰
              </option>
              <option value="multiplayer" className="text-4xl">
                多人對戰
              </option>
            </select>
          </div>
          <input
            type="text"
            ref={roomRef}
            placeholder="房間號碼"
            required
            className="px-4 py-2 text-4xl text-center border max-w-[22.5rem]"
          />
          <button type="submit" className="bg-[#8198BF] text-white px-36 py-4 text-4xl rounded-xl mt-3">
            輸入
          </button>
          <Link href="/" className="hover:border-b-1 text-[#8198BF] mt-5">
            建立自己的測驗
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Page;
