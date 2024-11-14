"use client";
import { useState, useEffect } from "react";
import Header from "../component/header";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  color_code: string;
}

const Home = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [colorCode, setColorCode] = useState("#888888");

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 初期のデータを取得する
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products.rows);
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("/api/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, stock, colorCode }),
    });
    const data = await response.json();
    if (data.error) {
      alert("エラーが発生しました");
    } else {
      alert("商品が追加されました");
      window.location.reload();
    }
  };

  const handleDelete = async (id: number) => {
    // 削除前に確認アラートを表示
    const isConfirmed = window.confirm("本当にこのアイテムを削除しますか？");
    if (!isConfirmed) return; // キャンセルした場合は処理を中断

    const response = await fetch(`/api/delete?id=${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert("アイテムが削除されました");
      setProducts(products.filter((product) => product.id !== id)); // 削除した商品を表示リストから削除
    }
  };

  return (
    <>
      <Header page="在庫管理" />
      <div className="wrapper">
        <div>
          <h3>登録アイテム</h3>
          {products.length === 0
            ? "登録アイテムがありません"
            : products.map((product, i) => (
                <div className="item-list" key={i}>
                  <h3>{product.name}</h3>
                  <p>
                    カラーコード:
                    {product.color_code
                      ? product.color_code
                      : "カラーコードは設定されていません"}
                  </p>
                  <p>価格: ¥{product.price}</p>
                  <p>現在の在庫: {product.stock}</p>
                  <button onClick={() => handleDelete(product.id)}>削除</button>
                </div>
              ))}
        </div>
        <div className="item-list">
          <h3>アイテム追加</h3>
          <form onSubmit={handleSubmit} className="add-form">
            <ul>
              <li>
                <label>アイテム名</label>
                <input
                  type="text"
                  placeholder="アイテム名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </li>
              <li>
                <label>価格</label>
                <input
                  type="number"
                  placeholder="価格"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </li>
              <li>
                <label>在庫</label>
                <input
                  type="number"
                  placeholder="在庫"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </li>
              <li>
                <label>カラーコード</label>
                <input
                  type="text"
                  placeholder="#888888"
                  value={colorCode}
                  onChange={(e) => setColorCode(e.target.value)}
                />
              </li>
            </ul>
            <button className="add" type="submit">
              登録する
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
