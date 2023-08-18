import Navbar from "../../../components/navbar";
import QuestonBankCard from "../../../components/questionbanks/QuestionCard";

function Page() {
  return (
    <div>
      <Navbar />
      <div className="flex justify-center mt-8">
        <QuestonBankCard />
      </div>
    </div>
  );
}

export default Page;
