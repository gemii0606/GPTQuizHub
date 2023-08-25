import useSWR from "swr";
import axios from "axios";
import nookies from "nookies";

const useQuizList = (selectedTag) => {
  const fetcher = async (url) => {
    const response = await axios.get(url, {
      params: { tag: selectedTag },
      headers: { Authorization: `Bearer ${nookies.get().access_token}` },
    });
    console.log(response);
    return [response.data.data.quizzes, response.data.data.next_cursor];
  };
  const { data, error } = useSWR([`${process.env.NEXT_PUBLIC_API_URL}/quizzes/search/`], fetcher);
  if (error) {
    console.log(error);
  }
  return {
    quizzes: data?.[0] || [],
    nextCursor: data?.[1] || null,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useQuizList;
