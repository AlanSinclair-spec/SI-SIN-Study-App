import { NextResponse } from "next/server";
import { getConnections } from "@/data/content";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const connections = getConnections();

  // Optionally fetch user's cross_references if authenticated
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: crossRefs } = await supabase
        .from("cross_references")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      return NextResponse.json({
        connections,
        userCrossReferences: crossRefs ?? [],
      });
    }
  } catch {
    // Not authenticated or Supabase unavailable -- just return static data
  }

  return NextResponse.json({
    connections,
    userCrossReferences: [],
  });
}
