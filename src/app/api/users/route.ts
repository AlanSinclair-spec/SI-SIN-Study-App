import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch user profile from users table
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    id: user.id,
    email: user.email,
    display_name: profile?.display_name ?? user.user_metadata?.display_name ?? null,
    created_at: profile?.created_at ?? user.created_at,
    updated_at: profile?.updated_at ?? null,
  });
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { display_name?: string };
  const { display_name } = body;

  if (!display_name || typeof display_name !== "string" || display_name.trim().length === 0) {
    return NextResponse.json({ error: "display_name is required" }, { status: 400 });
  }

  const { data: profile, error: updateError } = await supabase
    .from("users")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        display_name: display_name.trim(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    display_name: profile.display_name,
    created_at: profile.created_at,
    updated_at: profile.updated_at,
  });
}
