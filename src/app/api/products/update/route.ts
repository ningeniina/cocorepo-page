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
      // 在庫を減らす前に、現在の在庫が減少後0以上であることを確認
      const currentStockResult = await sql`
        SELECT stock FROM products WHERE id = ${id};
      `;

      const currentStock = currentStockResult.rows[0]?.stock;

      if (currentStock === undefined) {
        throw new Error(`Product with id ${id} not found`);
      }

      const newStock = currentStock - stock;

      if (newStock < 0) {
        throw new Error(
          `Cannot update stock for product ${id} as it would go below zero`
        );
      }

      // 在庫が0以上であれば更新
      const result = await sql`
        UPDATE products
        SET stock = stock - ${stock}
        WHERE id = ${id}
        RETURNING id, stock;
      `;

      const updatedProduct: Product = result.rows[0] as Product;

      // 更新した商品を追跡
      updatedProducts.push(updatedProduct);
    }

    // 更新後の商品一覧を返す
    const products = await sql`SELECT * FROM products;`;
    return NextResponse.json({ products: products.rows }, { status: 200 });
  } catch (error) {
    console.error(error);

    // エラーハンドリング: errorがErrorインスタンスかどうかを確認
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message }, // error.messageを返す
        { status: 500 }
      );
    }

    // 'unknown' 型に対しては、デフォルトメッセージを返す
    return NextResponse.json(
      { error: "在庫更新に失敗しました" },
      { status: 500 }
    );
  }
}
