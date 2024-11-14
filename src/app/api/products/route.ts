import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all products from the products table
    const products = await sql`SELECT * FROM products;`;
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "エラー" }, { status: 500 });
  }
}
