import axios from "axios";
import nookies from "nookies";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const useQuizList = (cursor) => {
  const router = useRouter();
  async function FetchQuizList() {
    const params = {};
    if (cursor) {
      params.cursor = cursor;
    }
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/quizzes/search`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
        params,
      });
      console.log(response);
      console.log(response.data.data.next_cursor);
      return [response.data.data.quizzes, response.data.data.next_cursor];
    } catch (error) {
      if (error.response?.status === 403) {
        Swal.fire("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        Swal.fire("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        Swal.fire("無法取得題庫", `${error}`, "error");
      }
      return null;
    }
  }
  return FetchQuizList;
};
export default useQuizList;
