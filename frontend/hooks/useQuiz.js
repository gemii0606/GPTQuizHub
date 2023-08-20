import useSWR from "swr";
import axios from "axios";
import nookies from "nookies";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const fetcher = async (url, token) => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data.quiz;
};

const useQuiz = (id) => {
  const { data, error } = useSWR(
    [`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}`, nookies.get().access_token],
    fetcher
  );
  const router = useRouter();
  if (error) {
    if (error.response?.status === 403) {
      Swal.fire("帳號已過期", "請重新登入", "error");
      router.push("/login");
    } else if (error.response?.status >= 500 && error.response?.status < 600) {
      Swal.fire("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
    } else {
      Swal.fire("無法取得題庫", `${error}`, "error");
    }
  }
  return {
    quiz: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useQuiz;
