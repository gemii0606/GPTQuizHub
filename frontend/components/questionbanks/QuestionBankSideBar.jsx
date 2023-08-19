const mocktags = [
  {
    id: 1,
    name: "tag1",
  },
  {
    id: 2,
    name: "tag2",
  },
  {
    id: 3,
    name: "tag3",
  },
  {
    id: 4,
    name: ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
  },
];

function QuestionBankSideBar() {
  const tagsItems = mocktags.map((tag) => (
    <p
      key={tag.id}
      type="button"
      // onClick={() => SelectTag(tag.name)}
      className="px-4 py-4 text-2xl font-bold border rounded-lg min-w-[15rem] max-w-[20rem] mt-4 hover:bg-[#8198BF] hover:text-white break-words cursor-pointer truncate"
    >
      {tag.name}
    </p>
  ));
  return (
    <div className="p-4 bg-white border rounded-xl">
      <p className="text-2xl font-bold leading-6 break-words whitespace-pre-wrap">題庫分類</p>
      {tagsItems}
    </div>
  );
}

export default QuestionBankSideBar;
