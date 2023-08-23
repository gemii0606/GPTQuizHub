import { useEffect, useState } from "react";
import { mutate } from "swr";
import useTags from "../../hooks/useTags";

function QuestionBankSideBar({ setSelectTag }) {
  const [taglist, setTagList] = useState([]);
  const { tags, isLoading, isError } = useTags();
  useEffect(() => {
    setTagList(tags);
  }, [tags]);
  const tagsItems = taglist?.map((tag) => (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <p
      key={tag.id}
      type="button"
      onClick={() => {
        setSelectTag(tag.name);
        mutate([`${process.env.NEXT_PUBLIC_API_URL}/quizzes/search/`]);
      }}
      className="px-4 py-4 text-2xl font-bold border rounded-lg min-w-[15rem] max-w-[20rem] mt-4 hover:bg-[#8198BF] hover:text-white break-words cursor-pointer truncate"
    >
      {tag.name}
    </p>
  ));
  return (
    <div className="p-4 bg-white border rounded-xl">
      <p className="text-2xl font-bold leading-6 break-words whitespace-pre-wrap">題庫分類</p>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error...</p>}
      {tagsItems}
    </div>
  );
}

export default QuestionBankSideBar;
