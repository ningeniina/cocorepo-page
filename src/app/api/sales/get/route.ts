// /api/sales.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// 売上金額を取得
export async function GET() {
  try {
    // id = 1 の売上金額を取得
    const result = await sql`
      SELECT id, amount, created_at
      FROM sales
      WHERE id = 1;
    `;

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "売上データが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json({ sales: result.rows }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "売上データの取得に失敗しました" },
      { status: 500 }
    );
  }
}
