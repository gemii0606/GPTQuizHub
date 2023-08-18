"use client";

import QuestionBankSideBar from "../../components/QuestionBankSideBar";
import QuestionsBanksCard from "../../components/QuestionBankCard";
// import useQuizList from "@/hooks/useQuizList";

const MockData = [
  {
    id: 1,
    title: "React 是什麼?",
  },
  {
    id: 2,
    title: "Docker 是什麼?",
  },
  {
    id: 3,
    title:
      ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
  },
];
const questionsBankItems = MockData.map((questionsBank) => (
  <QuestionsBanksCard questionsBank={questionsBank} key={questionsBank.id} />
));
function Page() {
  // const [quizzesData, setQuizzesData] = useState([]);
  // const [cursor, setCursor] = useState(null);
  // const fetchQuizzesData = useQuizList(null, cursor);
  return (
    <div className="flex justify-center mt-20">
      <div className="mr-10">
        <QuestionBankSideBar />
      </div>
      <div className="flex flex-col min-w-[60rem] rounded-lg bg-white border p-4 mr-6">
        <h1 className="mb-5 text-2xl font-bold leading-6">題庫</h1>
        {questionsBankItems}
      </div>
    </div>
  );
}

export default Page;
