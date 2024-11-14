"use client";
import { useState, useEffect } from "react";
import Header from "../component/header";

// 売上金額の型を定義
type Sale = {
  id: number;
  amount: number;
  created_at: string;
};

const Home = () => {
  const [sales, setSales] = useState<Sale[]>([]); // 売上データを保持

  // コンポーネントのマウント時にAPIを呼び出して売上データを取得
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch("/api/sales/get"); // 売上データを取得するAPIを呼び出し
        if (!response.ok) {
          throw new Error("売上金額の取得に失敗しました");
        }
        const data = await response.json();
        setSales(data.sales); // 売上データをステートに設定
      } catch (err) {
        console.log(err);
      }
    };

    fetchSales();
  }, []); // コンポーネントがマウントされたときだけ実行

  return (
    <>
      <Header page="売上" />
      <div className="wrapper">
        {sales.length > 0 ? (
          <ul>
            {sales.map((sale) => (
              <li key={sale.id}>
                <div className="sum">
                  売上金額: <span>¥ {sale.amount}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>売上データはありません</p>
        )}
      </div>
    </>
  );
};

export default Home;
