import useSWR from "swr";
import axios from "axios";
import nookies from "nookies";

const fetcher = async (url) => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${nookies.get().access_token}` },
  });
  console.log(response.data.data.quiz);
  return response.data.data.quiz;
};

const useQuiz = (id) => {
  const { data, error } = useSWR([`${process.env.NEXT_PUBLIC_API_URL}/quizzes/${id}/detail`], fetcher);
  return {
    quiz: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useQuiz;
