import Link from "next/link";
import QuestonBankCard from "../../components/QuestonBankCard";

const page = () => {
  return (
    <>
      <h1 className="text-xl">題庫</h1>
      <div className="bg-white border">
        <div>
          <Link href="/" className="block">
            網頁前端大挑戰
          </Link>
          <Link href="/" className="block">
            網頁前端大挑戰
          </Link>
          <Link href="/" className="block">
            網頁前端大挑戰
          </Link>
        </div>
        <QuestonBankCard />
      </div>
      <div>
        <Link href="/" className="mr-3">
          上一題
        </Link>
        <Link href="/">下一題</Link>
      </div>
    </>
  );
};

export default page;
