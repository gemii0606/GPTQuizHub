import useSWR from "swr";
import axios from "axios";
import nookies from "nookies";
import Swal from "sweetalert2";

const fetcher = async (url) => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${nookies.get().access_token}` },
  });
  console.log(response.data.data.tags);
  return response.data.data.tags;
};
const useTags = () => {
  const { data, error } = useSWR([`${process.env.NEXT_PUBLIC_API_URL}/users/tags`], fetcher);
  if (error) {
    console.log(error);
    if (error.response?.status >= 500 && error.response?.status < 600) {
      Swal.fire("Server Error", "請稍後再試或和我們的技術團隊聯絡", "error");
    } else {
      Swal.fire("無法取得分類", `${error}`, "error");
    }
  }
  return {
    tags: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useTags;
