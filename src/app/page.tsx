import Link from "next/link";

export default function Home() {
  return (
    <div className="wrapper top">
      <h1>
        即売会向け
        <br />
        在庫管理アプリ
      </h1>
      <div>
        <Link href={"/repo"}>レジ</Link>
        <Link href={"/add"}>在庫管理</Link>
        <Link href={"/setting"}>売上</Link>
      </div>
    </div>
  );
}
