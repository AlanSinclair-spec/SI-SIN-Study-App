import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const users = db.prepare("SELECT * FROM users ORDER BY name").all();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  const db = getDb();
  try {
    const result = db
      .prepare("INSERT INTO users (name) VALUES (?)")
      .run(name.trim());
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
}
