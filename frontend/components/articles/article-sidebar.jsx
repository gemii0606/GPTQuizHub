import React from "react";
import useTagApi from "../../hooks/tagApi";

function ArticleSidebar({ onTagButtonClick, name }) {
  const tags = useTagApi();
  return (
    <div className="w-[15vw]">
      <p className="mb-2 text-xl font-semibold">{name}分類</p>
      <div className="w-full p-4 mr-4 overflow-y-scroll bg-white h-[70vh] no-scrollbar rounded-md">
        {tags.map((tag) => (
          <button
            type="button"
            className="mb-2 text-base font-semibold hover:text-white hover:bg-[#84C1FF] w-full rounded-xl p-2 block break-words max-h-12 truncate"
            key={tag.id}
            onClick={() => onTagButtonClick(tag.name)}
          >
            {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ArticleSidebar;
