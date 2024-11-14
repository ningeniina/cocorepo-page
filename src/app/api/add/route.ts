import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, price, stock, colorCode } = await request.json();

  try {
    if (!name || !price || !stock) {
      throw new Error("Name, price, and stock are required");
    }

    // products テーブルに新しい商品を追加
    await sql`
      INSERT INTO products (name, price, stock, color_code) 
      VALUES (${name}, ${price}, ${stock}, ${colorCode});
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
