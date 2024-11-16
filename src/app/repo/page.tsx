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
  const [products, setProducts] = useState<Product[]>([]);
  const [stockChanges, setStockChanges] = useState<{ [key: number]: number }>(
    {}
  );

  useEffect(() => {
    // 初期のデータを取得する
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products.rows);
    };

    fetchProducts();
  }, []);

  const handleChange = (id: number, value: number) => {
    setStockChanges((prev) => ({
      ...prev,
      [id]: value < 0 ? 0 : value, // 0より下にならないように設定
    }));
  };

  const incrementStock = (id: number) => {
    setStockChanges((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decrementStock = (id: number) => {
    setStockChanges((prev) => ({
      ...prev,
      [id]: prev[id] > 0 ? prev[id] - 1 : 0, // 0より下にならないように設定
    }));
  };

  // 合計金額を計算する
  const calculateTotal = () => {
    return products.reduce((total, product) => {
      const quantity = stockChanges[product.id] || 0;
      return total + product.price * quantity;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isConfirmed = window.confirm("このレジを確定します。");
    if (!isConfirmed) return; // キャンセルした場合は処理を中断

    const changes = Object.entries(stockChanges).map(([id, change]) => ({
      id: parseInt(id),
      stock: change,
    }));

    const response = await fetch("/api/products/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    });

    if (response.ok) {
      const data = await response.json();
      setProducts(data.products);
      setStockChanges({});

      // 合計金額を計算
      const total = calculateTotal();

      const sumponse = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      if (sumponse.ok) {
        const data = await sumponse.json();
        console.log("売上金額更新:", data.sales);
      } else {
        console.error("売上金額の更新に失敗しました");
      }
    } else {
      alert("在庫の更新に失敗しました");
    }
  };

  return (
    <>
      <Header page="レジ" />
      <div className="wrapper fixed-true">
        <form onSubmit={handleSubmit} className="add-form">
          {products.length === 0
            ? "登録アイテムがありません"
            : products.map((product) => (
                <div className="item-list" key={product.id}>
                  <div className="item-data">
                    <div className="item-info">
                      <div
                        className="item-color"
                        style={{
                          background: product.color_code
                            ? product.color_code
                            : "#888888",
                        }}
                      >
                        {/* カラーコード表示 */}
                      </div>
                    </div>
                    <div className="item-button">
                      <h3>{product.name}</h3>
                      <div className="price">¥ {product.price}</div>
                      <div className="stock-control">
                        <button
                          type="button"
                          onClick={() => decrementStock(product.id)}
                        >
                          －
                        </button>
                        <input
                          type="number"
                          className="item-input"
                          value={stockChanges[product.id] || 0}
                          onChange={(e) =>
                            handleChange(
                              product.id,
                              parseInt(e.target.value) || 0
                            )
                          }
                        />
                        <button
                          className="plus"
                          type="button"
                          onClick={() => incrementStock(product.id)}
                        >
                          ＋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          <div className="submit">
            <div className="sum">
              合計金額: <span>¥ {calculateTotal()}</span>
            </div>
            <button className="enter" type="submit">
              決定
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Home;
