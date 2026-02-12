import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface NoteRow {
  id: string;
  book: string;
  chapter: number;
  section: string | null;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface HighlightRow {
  id: string;
  book: string;
  chapter: number;
  highlighted_text: string;
  note: string | null;
  color: string;
  created_at: string;
}

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch notes
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("book")
    .order("chapter");

  // Fetch highlights
  const { data: highlights } = await supabase
    .from("highlights")
    .select("*")
    .eq("user_id", user.id)
    .order("book")
    .order("chapter");

  const typedNotes = (notes ?? []) as NoteRow[];
  const typedHighlights = (highlights ?? []) as HighlightRow[];

  if (typedNotes.length === 0 && typedHighlights.length === 0) {
    return new NextResponse("# Study Notes\n\nNo notes or highlights yet.", {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": 'attachment; filename="study-notes.md"',
      },
    });
  }

  // Build markdown
  let md = "# Study Notes Export\n\n";
  md += `_Exported on ${new Date().toISOString().split("T")[0]}_\n\n`;

  // Collect all books
  const allBooks = new Set([
    ...typedNotes.map((n) => n.book),
    ...typedHighlights.map((h) => h.book),
  ]);

  for (const bookKey of Array.from(allBooks).sort()) {
    const bookNotes = typedNotes.filter((n) => n.book === bookKey);
    const bookHighlights = typedHighlights.filter((h) => h.book === bookKey);

    md += `## ${bookKey}\n\n`;

    // Group by chapter
    const chapters = new Set([
      ...bookNotes.map((n) => n.chapter),
      ...bookHighlights.map((h) => h.chapter),
    ]);

    const sortedChapters = Array.from(chapters).sort((a, b) => a - b);

    for (const ch of sortedChapters) {
      md += `### Chapter ${ch}\n\n`;

      const chNotes = bookNotes.filter((n) => n.chapter === ch);
      if (chNotes.length > 0) {
        md += "#### Notes\n\n";
        for (const note of chNotes) {
          if (note.section) {
            md += `**${note.section}**\n\n`;
          }
          md += `${note.content}\n\n`;
          if (note.tags.length > 0) {
            md += `_Tags: ${note.tags.join(", ")}_\n\n`;
          }
          md += "---\n\n";
        }
      }

      const chHighlights = bookHighlights.filter((h) => h.chapter === ch);
      if (chHighlights.length > 0) {
        md += "#### Highlights\n\n";
        for (const hl of chHighlights) {
          md += `> ${hl.highlighted_text}\n\n`;
          if (hl.note) {
            md += `_${hl.note}_\n\n`;
          }
        }
      }
    }
  }

  return new NextResponse(md, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="study-notes.md"',
    },
  });
}
