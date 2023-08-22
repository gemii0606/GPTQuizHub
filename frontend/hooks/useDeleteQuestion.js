import { useRouter } from "next/navigation";
import axios from "axios";
import nookies from "nookies";
import Swal from "sweetalert2";

const useDeleteQuestion = (id) => {
  const router = useRouter();
  async function DeleteQuestion() {
    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/questions/${id}`, {
        headers: { Authorization: `Bearer ${nookies.get().access_token}` },
      });
      console.log(response);
      return response.data.data.question;
    } catch (error) {
      if (error.response?.status === 403) {
        Swal.fire("帳號已過期", "請重新登入", "error");
        router.push("/login");
      }
      if (error?.response?.status >= 500 && error?.response?.status < 600) {
        Swal.fire("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
      } else {
        Swal.fire("無法刪除題庫", `${error}`, "error");
      }
      return null;
    }
  }
  return DeleteQuestion;
};

export default useDeleteQuestion;
