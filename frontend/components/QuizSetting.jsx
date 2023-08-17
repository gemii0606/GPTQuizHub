import { useRef } from "react";
import Swal from "sweetalert2";
import Modal from "./layout/Modal";

function QuizSetting({
  modalToggleHandler,
  randomOptions,
  setRandomOptions,
  questionSeconds,
  setQuestionSeconds,
  randomOrder,
  setRandomOrder,
  questionNumber,
  setQuestionNumber,
}) {
  const questionNumberRef = useRef(null);
  const questionSecondRef = useRef(null);
  return (
    <Modal>
      <div className="flex flex-col items-center">
        <p className="pt-6 pb-4 text-3xl text-center text-black">測驗設定</p>
        <button
          type="button"
          onClick={() => modalToggleHandler()}
          className="absolute px-4 py-2 border border-black rounded-lg top-6 right-6"
        >
          關閉
        </button>
        <div>
          <div className="flex items-center">
            <p className="mr-5 text-3xl">題目數量</p>
            <input
              type="number"
              max={10}
              disabled
              min="1"
              defaultValue={questionNumber}
              ref={questionNumberRef}
              className="px-2 mr-5 text-3xl border rounded-xl"
            />
            <button
              onClick={() => {
                setQuestionNumber(questionNumberRef.current.value);
                Swal.fire("修改成功", "", "success");
              }}
              disabled
              type="button"
              className="px-[2.125rem] py-4 text-white font-outfit font-normal text-3xl leading-6 rounded-md bg-sky-500"
            >
              更改題目數
            </button>
            <p className="ml-3">此功能尚未開放</p>
          </div>
          <div className="flex items-center mt-5">
            <p className="mr-5 text-3xl">題目秒數</p>
            <input
              type="number"
              max="60"
              min="5"
              defaultValue={questionSeconds}
              ref={questionSecondRef}
              className="px-2 mr-5 text-3xl border rounded-xl"
            />
            <button
              onClick={() => {
                setQuestionSeconds(questionSecondRef.current.value);
                Swal.fire("修改成功", "", "success");
              }}
              type="button"
              className="px-[2.125rem] py-4 text-white font-outfit font-normal text-3xl leading-6 rounded-md bg-sky-500"
            >
              更改秒數
            </button>
          </div>
          <div className="flex items-center mt-5">
            <p className="mr-5 text-3xl">隨機題目排序</p>
            <button
              type="button"
              disabled
              className="px-[2.125rem] py-4 text-white font-outfit font-normal text-3xl leading-6 rounded-md bg-sky-500"
              onClick={() => {
                setRandomOrder((prev) => !prev);
              }}
            >
              {randomOrder ? "啟用" : "未啟用"}
            </button>
            <p className="ml-3">此功能尚未開放</p>
          </div>
          <div className="flex items-center mt-5">
            <p className="mr-5 text-3xl">隨機選項排序</p>
            <button
              type="button"
              className="px-[2.125rem] py-4 text-white font-outfit font-normal text-3xl leading-6 rounded-md bg-sky-500"
              onClick={() => {
                setRandomOptions((prev) => !prev);
              }}
            >
              {randomOptions ? "啟用" : "未啟用"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default QuizSetting;
