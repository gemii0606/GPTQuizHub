import useSWR from "swr";
import axios from "axios";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const fetcher = async (url, token, cursor) => {
  const params = cursor ? { cursor } : {};
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return [response.data.data.quizzes, response.data.data.next_cursor];
};

const useQuizList = (cursor) => {
  const router = useRouter();
  const { data, error } = useSWR(
    [`${process.env.NEXT_PUBLIC_API_URL}/quizzes/search`, nookies.get().access_token, cursor],
    fetcher
  );
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
    quizzes: data?.[0] || [],
    nextCursor: data?.[1] || null,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useQuizList;
