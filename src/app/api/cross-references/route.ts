import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("cross_references")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: {
    sourceBook?: string;
    sourceChapter?: number;
    targetBook?: string;
    targetChapter?: number;
    connectionNote?: string;
  } = await request.json();

  if (
    !body.sourceBook ||
    body.sourceChapter === undefined ||
    !body.targetBook ||
    body.targetChapter === undefined ||
    !body.connectionNote
  ) {
    return NextResponse.json(
      {
        error:
          "Missing required fields: sourceBook, sourceChapter, targetBook, targetChapter, connectionNote",
      },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("cross_references")
    .insert({
      user_id: user.id,
      source_book: body.sourceBook,
      source_chapter: body.sourceChapter,
      target_book: body.targetBook,
      target_chapter: body.targetChapter,
      connection_note: body.connectionNote,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
