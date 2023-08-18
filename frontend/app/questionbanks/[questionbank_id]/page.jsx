<<<<<<< HEAD
import Navbar from "../../../components/navbar";
import QuestonBankCard from "../../../components/questionbanks/QuestionCard";

function Page() {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center mt-8">
        <QuestonBankCard />
      </div>
=======
import QuestonBankCard from "../../../components/QuestionCard";

function Page() {
  return (
    <div className="flex justify-center mt-8">
      <QuestonBankCard />
>>>>>>> feat/question-bank
    </div>
  );
}

export default Page;
