import { useRef } from "react";
import Swal from "sweetalert2";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Modal from "./layout/Modal";
import Close from "../public/close.png";

function QuizSetting({
  modalToggleHandler,
  randomOptions,
  setRandomOptions,
  questionSeconds,
  setQuestionSeconds,
  correctRatio,
  setCorrectRatio,
  setUseCorrectRatio,
  useCorrectRatio,
}) {
  const questionSecondRef = useRef(null);
  const correctRatioRef = useRef(null);
  const pathname = usePathname();
  return (
    <Modal>
      <div className="flex flex-col items-center">
        <div className="flex items-center">
          <Image src="/settings.png" alt="setting" width={100} height={100} className="w-8 h-8 mr-4" />
          <p className="pt-6 pb-4 text-3xl font-semibold text-center text-black">Setting</p>
        </div>
        <button type="button" onClick={() => modalToggleHandler()} className="absolute top-6 right-6">
          <Image src={Close} alt="close-button" width={30} height={30} />
        </button>
        <div>
          {(pathname.includes("/twoplayer") || pathname.includes("/multiplayer")) && (
            <div className="flex items-center mt-5">
              <p className="mr-5 text-3xl">得分倍率</p>
              <button
                type="button"
                className="px-[2.125rem] py-4 mr-5 text-white font-outfit font-normal text-xl leading-6 rounded-md bg-primary"
                onClick={() => {
                  setUseCorrectRatio((prev) => !prev);
                }}
              >
                {useCorrectRatio ? "啟用" : "未啟用"}
              </button>
              {useCorrectRatio && (
                <>
                  <input
                    type="number"
                    min="1.01"
                    max="2"
                    step="0.01"
                    defaultValue={correctRatio}
                    ref={correctRatioRef}
                    className="px-2 mr-5 text-3xl border rounded-xl"
                  />
                  <button
                    onClick={() => {
                      setCorrectRatio(correctRatioRef.current.value);
                      Swal.fire({
                        icon: "success",
                        title: "得分倍率修改成功",
                        showConfirmButton: false,
                        timer: 1000,
                      });
                    }}
                    type="button"
                    className="px-[2.125rem] py-4 text-white font-outfit font-normal text-3xl leading-6 rounded-md bg-sky-500"
                  >
                    更改得分倍率
                  </button>
                </>
              )}
            </div>
          )}
          <div className="flex items-center mt-5">
            <p className="mr-5 text-2xl font-semibold">題目秒數</p>
            <input
              type="number"
              max="60"
              min="5"
              defaultValue={questionSeconds}
              ref={questionSecondRef}
              className="px-2 mr-5 text-xl border rounded-xl"
            />
            <button
              onClick={() => {
                setQuestionSeconds(questionSecondRef.current.value);
                Swal.fire({
                  icon: "success",
                  title: "修改成功",
                  showConfirmButton: false,
                  timer: 600,
                });
              }}
              type="button"
              className="px-6 py-4 text-xl font-normal leading-6 text-white bg-indigo-500 rounded-md hover:bg-indigo-700"
            >
              更改秒數
            </button>
          </div>
          <div className="flex items-center mt-5">
            <p className="mr-5 text-2xl font-semibold">隨機選項模式</p>
            {randomOptions ? (
              <button
                type="button"
                className="px-6 py-4 text-xl font-normal leading-6 text-white bg-blue-500 rounded-md font-outfit"
                onClick={() => {
                  setRandomOptions((prev) => !prev);
                }}
              >
                {randomOptions ? "ON" : "OFF"}
              </button>
            ) : (
              <button
                type="button"
                className="px-6 py-4 text-xl font-normal leading-6 text-white rounded-md font-outfit bg-[#8198BF]"
                onClick={() => {
                  setRandomOptions((prev) => !prev);
                }}
              >
                {randomOptions ? "ON" : "OFF"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default QuizSetting;
