import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import useTagApi from "../../hooks/tagApi";

function Storearticle() {
  const [easy, setEasy] = useState("");
  const [normal, setNormal] = useState("");
  const [hard, setHard] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to hold error message
  const [showMenu, setShowMenu] = useState(false);
  const [tag, setTag] = useState("");
  const tagRef = useRef(null);
  const tags = useTagApi();
  const router = useRouter();
  // const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    console.log(nookies.get().access_token);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/quizzes/create`,
        {
          article: {
            title,
            tag,
            easy,
            normal,
            hard,
            content,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${nookies.get().access_token}`,
          },
        }
      );
      console.log(tag);
      console.log("Completed!", response);
      Swal.fire("Succesfully submit", "Let's create the questions!", "success");
      router.push("/questionbanks");
    } catch (error) {
      console.log(error);
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        Swal.fire("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        Swal.fire("生成失敗", `${error}`, "error");
      }
    }
    // setLoading(false);
  };

  function handleInputChange(e, difficulty) {
    const newValue = e.target.value;
    switch (difficulty) {
      case "easy":
        setEasy(newValue);
        break;
      case "normal":
        setNormal(newValue);
        break;
      case "hard":
        setHard(newValue);
        break;
      default:
        break;
    }
    // eslint-disable-next-line max-len
    const totalQuestion = parseInt(easy || 0, 10) + parseInt(normal || 0, 10) + parseInt(hard || 0, 10);
    if (totalQuestion > 10) {
      setErrorMessage("題數不可超過10題");
    } else {
      setErrorMessage("");
    }
  }
  const handleOutsideClick = (e) => {
    const clickedElement = e.target;
    if (tagRef.current && !tagRef.current.contains(clickedElement)) {
      setShowMenu(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  });
  function handleShowMenu() {
    setShowMenu(true);
  }
  function handleTagClick(clickedTag) {
    setShowMenu(false);
    setTag(clickedTag);
  }
  return (
    <div className="p-8 m-0">
      <form action="" method="post" onSubmit={handleSubmit}>
        <p className="mb-2 text-base font-bold">文章標題</p>
        <input
          required
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 mb-2 rounded-md outline-none w-80 drop-shadow-md hover:bg-slate-50 focus:drop-shadow-2xl"
        />
        <p className="mt-1 mb-2 text-base font-bold">文章類別</p>
        <div className="relative h-auto w-60">
          <input
            required
            placeholder="未分類"
            id="123"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            ref={tagRef}
            onFocus={() => {
              if (tag === "") {
                setTag(""); // 清空默认文本，允许用户编辑
              }
            }}
            onBlur={() => {
              if (tag === "") {
                setTag("未分類"); // 恢复默认文本，如果输入框为空
              }
            }}
            className="block px-3 py-2 mb-2 rounded-md shadow-sm outline-none w-60 drop-shadow-md hover:bg-slate-50 focus:drop-shadow-2xl"
            onClick={handleShowMenu}
          />
          {showMenu && (
            <div className="absolute z-10 w-full overflow-y-scroll h-42 top-11">
              {tags.map((taggie) => (
                <button
                  type="button"
                  key={taggie.id}
                  onClick={() => handleTagClick(taggie.name)} // Pass the clicked tag to the function
                  className="block w-full p-2 bg-white border-2 top-12 hover:bg-[#D2E9FF] h-10 truncate"
                >
                  {taggie.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <p className="mb-2 text-base font-bold">文章內容</p>
        <textarea
          required
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 mb-2 rounded-md h-[50vh] drop-shadow-md hover:bg-slate-50 resize-none outline-none focus:drop-shadow-2xl"
          placeholder="Relation between Java and Javascript is like dog and hotdog."
        />
        <p className="mt-1 mb-2 text-base font-bold">題目設定</p>
        <div className="flex items-center w-full h-24 p-2 bg-white rounded drop-shadow-lg">
          <p className="justify-center mt-4 ml-10 text-base font-bold">
            設定題目難易度
            <br />
            (最多共十題問題)
          </p>
          <p className="ml-6 text-base font-bold">簡易:</p>
          <input
            required
            type="number"
            name="easy"
            min="0"
            max="10"
            onChange={(e) => handleInputChange(e, "easy")}
            className="w-16 px-3 py-2 ml-2 rounded-md outline-none bg-slate-200"
          />
          <p className="ml-6 text-base font-bold">中等:</p>
          <input
            required
            type="number"
            name="middle"
            min="0"
            max="10"
            onChange={(e) => handleInputChange(e, "normal")}
            className="w-16 px-3 py-2 ml-2 rounded-md outline-none bg-slate-200"
          />
          <p className="ml-6 text-base font-bold">困難:</p>
          <input
            required
            type="number"
            name="hard"
            min="0"
            max="10"
            onChange={(e) => handleInputChange(e, "hard")}
            className="w-16 px-3 py-2 ml-2 rounded-md outline-none bg-slate-200"
          />
          {errorMessage && <p className="ml-2 text-red-500">{errorMessage}</p>}
        </div>
        <button
          id="submitBtn"
          type="submit"
          className="block bg-primary text-white px-6 py-1 rounded-md mt-4 ml-auto hover:bg-[#638ace]"
        >
          生成題目
        </button>
      </form>
    </div>
  );
}

export default Storearticle;
