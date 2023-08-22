import { useEffect, useState } from "react";
import axios from "axios";
import nookies from "nookies";

const useTagApi = () => {
  const [tags, setTags] = useState([]);
  const fetchTags = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/tags`, {
        headers: {
          Authorization: `Bearer ${nookies.get().access_token}`,
        }
      });
      setTags(response.data.data.tags);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTags();
    console.log(tags);
  }, []);

  return tags;
};

export default useTagApi;
