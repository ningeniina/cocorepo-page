import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

// DELETE リクエストで商品を削除
export async function DELETE(request: Request) {
  // リクエストURLからidパラメーターを取得
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // idが指定されているか確認
  if (!id) {
    return NextResponse.json(
      { error: "アイテムのIDが指定されていません" },
      { status: 400 }
    );
  }

  try {
    // 指定されたidの商品を削除
    const result = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING id;
    `;

    // 削除結果が空の場合、対象の商品が見つからなかったと判断
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: `ID ${id} のアイテムが見つかりませんでした` },
        { status: 404 }
      );
    }

    // 削除成功時のレスポンス
    return NextResponse.json(
      { message: `ID ${id} のアイテムが削除されました` },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "アイテムの削除に失敗しました" },
      { status: 500 }
    );
  }
}
