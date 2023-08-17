import React, { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import Swal from "sweetalert2";
import Modal from "./layout/Modal";

function ShareLink({ modalToggleHandler }) {
  const inputRef = useRef(null);
  const currentUrl = window.location.href;
  const copyLink = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current?.value);
    }
    Swal.fire("已複製到剪貼簿", "分享給其他朋友", "success");
  };
  return (
    <Modal>
      <div className="flex flex-col items-center">
        <p className="pt-6 pb-4 text-2xl text-center text-black font-outfit">分享個人連結</p>
        <button
          type="button"
          onClick={() => modalToggleHandler()}
          className="absolute px-4 py-2 border border-black rounded-lg top-6 right-6"
        >
          關閉
        </button>
        <div className="flex flex-col items-center mx-2 mb-4">
          <QRCodeSVG value={currentUrl} size={250} />
          <div className="flex items-center mt-6">
            <input
              className="py-1 mr-2 w-[16rem] border rounded-lg"
              defaultValue={currentUrl}
              ref={inputRef}
            />
            <button
              type="button"
              onClick={copyLink}
              className="px-2 py-1 border rounded-lg dark:text-black"
            >
              複製
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ShareLink;
