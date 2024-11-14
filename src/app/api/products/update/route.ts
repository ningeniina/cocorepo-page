import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// 更新した商品の型を定義
type StockChange = {
  id: number;
  stock: number; // 増減する在庫
};

type Product = {
  id: number;
  stock: number;
};

export async function POST(request: Request) {
  const stockChanges: StockChange[] = await request.json();

  const updatedProducts: Product[] = [];

  try {
    // 商品の在庫を順番に更新
    for (const { id, stock } of stockChanges) {
      // 在庫を増減（`stock` は増減値を含んでいる）
      const result = await sql`
        UPDATE products
        SET stock = stock - ${stock}
        WHERE id = ${id}
        RETURNING id, stock;
      `;

      // 型アサーションで、result.rows[0] の型を明示的に指定
      const updatedProduct: Product = result.rows[0] as Product;

      // 結果が空であればエラーをスロー
      if (!updatedProduct) {
        throw new Error(`Product with id ${id} not found`);
      }

      // 更新した商品を追跡
      updatedProducts.push(updatedProduct);
    }

    // 更新後の商品一覧を返す
    const products = await sql`SELECT * FROM products;`;
    return NextResponse.json({ products: products.rows }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "在庫更新に失敗しました" },
      { status: 500 }
    );
  }
}
