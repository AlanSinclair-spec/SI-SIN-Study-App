import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { action, sessionId } = body as { action: string; sessionId?: string };

  if (action === "start") {
    const { data, error } = await supabase
      .from("study_sessions")
      .insert({
        user_id: user.id,
        session_type: "daily",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (action === "complete" && sessionId) {
    const { error } = await supabase
      .from("study_sessions")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
