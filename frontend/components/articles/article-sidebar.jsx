import React from "react";

const articleSidebar = () => {
  return (
    <div className="w-[15vw]">
      <p className="mb-2 text-xl font-semibold">文章分類</p>
      <div className="w-full p-4 mr-4 overflow-y-scroll bg-white h-[70vh] no-scrollbar rounded-md">
        <button type="button" className="mb-2 text-xl font-semibold hover:text-white hover:bg-[#8198BF] min-w-3/4 rounded-xl p-2 h-auto block break-words">React</button>
        <button type="button" className="mb-2 text-xl font-semibold hover:text-white hover:bg-[#8198BF] min-w-3/4 rounded-xl p-2 h-auto block break-words">
          Docker
        </button>
        <button type="button" className="mb-2 text-xl font-semibold hover:text-white hover:bg-[#8198BF] min-w-3/4 rounded-xl p-2 h-auto block break-words">
          Tailwind
        </button>
        <button type="button" className="mb-2 text-xl font-semibold hover:text-white hover:bg-[#8198BF] min-w-3/4 rounded-xl p-2 h-auto block break-words">
          Quokka
        </button>
        <button type="button" className="mb-2 text-xl font-semibold hover:text-white hover:bg-[#8198BF] min-w-3/4 rounded-xl p-2 h-auto block break-words">
          Marshmallow
        </button>
        <button type="button" className="mb-2 text-xl font-semibold hover:text-white hover:bg-[#8198BF] min-w-3/4 rounded-xl p-2 h-auto block break-words">
          標籤
        </button>
        <button type="button" className="mb-2 text-xl font-semibold hover:text-white hover:bg-[#8198BF] min-w-3/4 rounded-xl p-2 h-auto block break-words">
          標籤標籤標籤標籤標籤標籤標籤標籤標籤
        </button>
      </div>
    </div>
  );
};

export default articleSidebar;
