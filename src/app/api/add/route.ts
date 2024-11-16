import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, price, stock, colorCode, initialPrice } = await request.json();

  try {
    // 必須フィールドのバリデーション
    if (!name || !price || !stock || !initialPrice) {
      throw new Error("Name, price, stock, and initialPrice are required");
    }

    // products テーブルに新しい商品を追加
    await sql`
      INSERT INTO products (name, price, stock, color_code, initial_price) 
      VALUES (${name}, ${price}, ${stock}, ${colorCode}, ${initialPrice});
    `;
    return NextResponse.json(
      { message: "Product added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 }
    );
  }
}
