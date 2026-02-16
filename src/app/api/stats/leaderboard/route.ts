import { NextResponse } from "next/server";

// Leaderboard is deprecated in favor of personal stats.
// With Supabase auth, we focus on individual user progress
// rather than cross-user comparisons.
export async function GET() {
  return NextResponse.json([]);
}
