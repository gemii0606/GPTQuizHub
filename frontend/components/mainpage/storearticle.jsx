import React, { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import nookies from "nookies";

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
  // const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(true);
    console.log(nookies.get().access_token);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/create`, {
        article: {
          title,
          tag,
          easy,
          normal,
          hard,
          content,
        }
      }, {
        headers: {
          Authorization: `Bearer ${nookies.get().access_token}`,
        }
      });
      console.log("Completed!", response);
      Swal.fire(
        "Succesfully submit",
        "Let's create the questions!",
        "success"
      );
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
  const fakeData = {
    data: {
      quizzes: [
        {
          id: 1,
          title: "React 是什麼?",
          tag: "天竺鼠",
          created_at: "2023-08-15 15:30:00",
          status: "pending",
        },
        {
          id: 2,
          title: "Docker 是什麼?",
          tag: "雞娃娃",
          created_at: "2023-08-15 15:30:00",
          status: "ok",
        },
        {
          id: 3,
          title: "Docker 是什麼?",
          tag: "吉娃娃",
          created_at: "2023-08-15 15:30:00",
          status: "ok",
        },
        {
          id: 4,
          title: "Docker 是什麼?",
          tag: "可愛吉娃娃",
          created_at: "2023-08-15 15:30:00",
          status: "ok",
        },
        {
          id: 5,
          title: "Docker 是什麼?",
          tag: "瘋癲吉娃娃",
          created_at: "2023-08-15 15:30:00",
          status: "ok",
        },
      ],
      next_cursor: "KHEAX0GAFjlPyyqAqTcQOXTLKgIVvshji9AqRmuAGjCDESoLlUrrIn7P",
    },
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
        <p className="mb-2 text-base">文章標題</p>
        <input required onChange={(e) => setTitle(e.target.value)} className="px-3 py-2 mb-2 rounded-md w-80 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]" />
        <p className="mt-1 mb-2 text-base">文章類別</p>
        <div className="relative h-auto w-60">
          <input required placeholder="未分類" id="123" value={tag} onChange={(e) => setTag(e.target.value)} ref={tagRef} className=" mb-2 w-60 block px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-slate-200 ring-1 ring-[#8198BF] focus:border-[#8198BF]" onClick={handleShowMenu} />
          <div className="absolute w-full h-40 overflow-y-scroll top-11 no-scrollbar">
            {showMenu && fakeData.data.quizzes.map((quiz) => (
              <button
                type="button"
                key={quiz.id}
                onClick={() => handleTagClick(quiz.tag)} // Pass the clicked tag to the function
                className="block w-full p-2 border-2 bg-slate-200 top-12 border-slate-300 hover:bg-slate-400"
              >
                {quiz.tag}
              </button>
            ))}
          </div>

        </div>
        <p className="mb-2 text-base ">文章內容</p>
        <textarea required onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 mb-2 rounded-md bg-slate-200 h-[50vh] ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF] resize-none" placeholder="Relation between Java and Javascript is like dog and hotdog." />
        <p className="mt-1 mb-2 text-base">題目設定</p>
        <div className="flex items-center w-full h-24 p-2 bg-white rounded">
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
            className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          />
          <p className="ml-6 text-base font-bold">中等:</p>
          <input
            required
            type="number"
            name="middle"
            min="0"
            max="10"
            onChange={(e) => handleInputChange(e, "normal")}
            className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          />
          <p className="ml-6 text-base font-bold">困難:</p>
          <input
            required
            type="number"
            name="hard"
            min="0"
            max="10"
            onChange={(e) => handleInputChange(e, "hard")}
            className="px-3 py-2 ml-2 rounded-md w-16 bg-slate-200 ring-1 ring-[#8198BF] hover:ring-2 hover:ring-[#8198BF]"
          />
          {errorMessage && <p className="ml-2 text-red-500">{errorMessage}</p>}
        </div>
        <button id="submitBtn" type="submit" className="block bg-[#8198BF] text-white px-6 py-1 rounded-md mt-4 ml-auto hover:bg-[#638ace]">生成題目</button>
      </form>
    </div>
  );
}

export default Storearticle;
