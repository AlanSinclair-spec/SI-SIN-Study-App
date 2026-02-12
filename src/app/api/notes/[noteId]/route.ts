import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Note not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { content, section, tags } = body as {
    content?: string;
    section?: string;
    tags?: string[];
  };

  const updates: Record<string, string | string[] | null> = {
    updated_at: new Date().toISOString(),
  };
  if (content !== undefined) updates.content = content;
  if (section !== undefined) updates.section = section;
  if (tags !== undefined) updates.tags = tags;

  const { data, error } = await supabase
    .from("notes")
    .update(updates)
    .eq("id", noteId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: "Note not found or update failed" }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ noteId: string }> }
) {
  const { noteId } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
