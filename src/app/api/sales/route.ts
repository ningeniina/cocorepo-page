import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// POSTメソッドで売上金額を追加する処理
export async function POST(request: Request) {
  try {
    const { amount }: { amount: number } = await request.json();

    // id=1 の売上金額に新しいamountを加算
    const result = await sql`
      UPDATE sales
      SET amount = amount + ${amount}
      WHERE id = 1
      RETURNING id, amount;
    `;

    // 更新後のデータをレスポンスとして返す
    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "売上ID 1 のデータが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { sales: result.rows[0] }, // 更新後の売上データ
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "売上金額の更新に失敗しました" },
      { status: 500 }
    );
  }
}
