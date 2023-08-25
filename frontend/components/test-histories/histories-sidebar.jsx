import React from "react";

function HistoriesSidebar() {
  return (
    <div className="w-[15vw]">
      <p className="mb-2 text-xl font-semibold">測驗紀錄</p>
      <div className="w-full p-4 mr-4 overflow-y-scroll bg-white h-[40vh] no-scrollbar rounded-md">
        <button type="button" className="mb-2 text-xl font-semibold hover:text-white hover:bg-[#8198BF] min-w-3/4 rounded-xl p-2 h-auto block break-words">
          單人測驗
        </button>
        <button type="button" className="mb-2 text-xl font-semibold hover:text-white hover:bg-[#8198BF] min-w-3/4 rounded-xl p-2 h-auto block break-words">
          雙人測驗
        </button>
      </div>
    </div>
  );
}

export default HistoriesSidebar;
