import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const connections = db
    .prepare("SELECT * FROM connections ORDER BY id")
    .all();
  return NextResponse.json(connections);
}
