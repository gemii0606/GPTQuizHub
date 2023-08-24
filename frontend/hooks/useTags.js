import useSWR from "swr";
import axios from "axios";
import nookies from "nookies";

const fetcher = async (url) => {
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${nookies.get().access_token}` },
  });
  console.log(response.data.data.tags);
  return response.data.data.tags;
};
const useTags = () => {
  const { data, error } = useSWR([`${process.env.NEXT_PUBLIC_API_URL}/users/tags`], fetcher, {
    revalidateOnFocus: false,
  });
  return {
    tags: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useTags;
