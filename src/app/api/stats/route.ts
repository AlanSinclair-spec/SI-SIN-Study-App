import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: stats, error } = await supabase.rpc("get_user_stats", { p_user_id: user.id });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get weak concepts
  const { data: weakConcepts } = await supabase.rpc("get_weak_concepts", { p_user_id: user.id });

  // Get user profile
  const { data: profile } = await supabase.from("users").select("display_name").eq("id", user.id).single();

  return NextResponse.json({
    user_id: user.id,
    user_name: profile?.display_name ?? "Unknown",
    ...stats,
    weak_concepts: weakConcepts ?? [],
  });
}
