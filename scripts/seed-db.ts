import { createClient } from "@supabase/supabase-js";
import { books } from "../src/data/seed/books";

// Use service role key for seeding (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface SeedChapter {
  ref: string;
  number: number;
  title: string;
  slug: string;
  summary?: string;
  bookRef?: string;
}

interface SeedConcept {
  ref: string;
  chapterRef: string;
  title: string;
  description: string;
  importance: string;
}

interface SeedArgument {
  conceptRef: string;
  title: string;
  description: string;
}

interface SeedQuote {
  chapterRef: string;
  text: string;
  context?: string;
}

interface SeedFlashcard {
  bookRef: string;
  chapterRef?: string;
  front: string;
  back: string;
  difficulty?: string;
  tags?: string[];
}

interface SeedQuizQuestion {
  bookRef: string;
  chapterRef?: string;
  question_type: string;
  question_text: string;
  correct_answer: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
  explanation?: string;
  difficulty?: string;
}

interface SeedConnection {
  title: string;
  description: string;
  sin_theme: string;
  si_theme: string;
  relationship: string;
  detailed_analysis?: string;
}

interface BookSeed {
  ref: string;
  title: string;
  author: string;
  slug: string;
  description: string;
  year: number;
}

async function loadModule(modulePath: string) {
  try {
    return await import(modulePath);
  } catch {
    console.warn(`  Warning: Could not load ${modulePath}`);
    return null;
  }
}

async function seed() {
  console.log("Seeding Supabase database...");
  console.log(`URL: ${supabaseUrl}`);

  // Clear existing content data (in reverse FK order)
  const contentTables = [
    "connections", "quiz_questions", "flashcards", "quotes",
    "arguments", "concepts", "chapters", "books",
  ];
  for (const table of contentTables) {
    const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) console.warn(`  Warning clearing ${table}: ${error.message}`);
  }
  console.log("Cleared existing content data.");

  // ─── BOOKS ───────────────────────────────────────────────────────
  const bookIdMap: Record<string, string> = {};
  for (const book of books as BookSeed[]) {
    const { data, error } = await supabase.from("books").insert({
      title: book.title, author: book.author, slug: book.slug,
      description: book.description, year: book.year,
    }).select("id").single();
    if (error) { console.error(`Error inserting book: ${error.message}`); continue; }
    bookIdMap[book.ref] = data.id;
  }
  console.log(`Inserted ${Object.keys(bookIdMap).length} books.`);

  // ─── CHAPTERS ────────────────────────────────────────────────────
  const chapterIdMap: Record<string, string> = {};
  const sinChaptersMod = await loadModule("../src/data/seed/sin-chapters");
  const siChaptersMod = await loadModule("../src/data/seed/si-chapters");
  const allChapters: SeedChapter[] = [
    ...(sinChaptersMod?.sinChapters || []).map((c: SeedChapter) => ({ ...c, bookRef: "sin" })),
    ...(siChaptersMod?.siChapters || []).map((c: SeedChapter) => ({ ...c, bookRef: "si" })),
  ];
  for (const ch of allChapters) {
    const bookId = bookIdMap[ch.bookRef || ""];
    if (!bookId) continue;
    const { data, error } = await supabase.from("chapters").insert({
      book_id: bookId, number: ch.number, title: ch.title,
      slug: ch.slug, summary: ch.summary || null,
    }).select("id").single();
    if (error) { console.error(`Error inserting chapter: ${error.message}`); continue; }
    chapterIdMap[ch.ref] = data.id;
  }
  console.log(`Inserted ${Object.keys(chapterIdMap).length} chapters.`);

  // ─── CONCEPTS ────────────────────────────────────────────────────
  const conceptIdMap: Record<string, string> = {};
  const sinConceptsMod = await loadModule("../src/data/seed/sin-concepts");
  const siConceptsMod = await loadModule("../src/data/seed/si-concepts");
  const allConcepts: SeedConcept[] = [...(sinConceptsMod?.sinConcepts || []), ...(siConceptsMod?.siConcepts || [])];
  for (const concept of allConcepts) {
    const chapterId = chapterIdMap[concept.chapterRef];
    if (!chapterId) continue;
    const importance = ["core", "supporting", "supplementary"].includes(concept.importance) ? concept.importance : "core";
    const { data, error } = await supabase.from("concepts").insert({
      chapter_id: chapterId, title: concept.title, description: concept.description, importance,
    }).select("id").single();
    if (error) { console.error(`Error inserting concept: ${error.message}`); continue; }
    conceptIdMap[concept.ref] = data.id;
  }
  console.log(`Inserted ${Object.keys(conceptIdMap).length} concepts.`);

  // ─── ARGUMENTS ───────────────────────────────────────────────────
  const sinArgsMod = await loadModule("../src/data/seed/sin-arguments");
  const siArgsMod = await loadModule("../src/data/seed/si-arguments");
  const allArguments: SeedArgument[] = [...(sinArgsMod?.sinArguments || []), ...(siArgsMod?.siArguments || [])];
  let argCount = 0;
  for (const arg of allArguments) {
    const conceptId = conceptIdMap[arg.conceptRef];
    if (!conceptId) continue;
    const { error } = await supabase.from("arguments").insert({ concept_id: conceptId, title: arg.title, description: arg.description });
    if (!error) argCount++;
  }
  console.log(`Inserted ${argCount} arguments.`);

  // ─── QUOTES ──────────────────────────────────────────────────────
  const sinQuotesMod = await loadModule("../src/data/seed/sin-quotes");
  const siQuotesMod = await loadModule("../src/data/seed/si-quotes");
  const allQuotes: SeedQuote[] = [...(sinQuotesMod?.sinQuotes || []), ...(siQuotesMod?.siQuotes || [])];
  let quoteCount = 0;
  for (const quote of allQuotes) {
    const chapterId = chapterIdMap[quote.chapterRef];
    if (!chapterId) continue;
    const { error } = await supabase.from("quotes").insert({ chapter_id: chapterId, text: quote.text, context: quote.context || null });
    if (!error) quoteCount++;
  }
  console.log(`Inserted ${quoteCount} quotes.`);

  // ─── FLASHCARDS ──────────────────────────────────────────────────
  const sinFlashcardsMod = await loadModule("../src/data/seed/flashcards-sin");
  const siFlashcardsMod = await loadModule("../src/data/seed/flashcards-si");
  const allFlashcards: SeedFlashcard[] = [...(sinFlashcardsMod?.sinFlashcards || []), ...(siFlashcardsMod?.siFlashcards || [])];
  let fcCount = 0;
  for (const fc of allFlashcards) {
    const bookId = bookIdMap[fc.bookRef];
    if (!bookId) continue;
    const chapterId = fc.chapterRef ? chapterIdMap[fc.chapterRef] || null : null;
    const { error } = await supabase.from("flashcards").insert({
      book_id: bookId, chapter_id: chapterId, front: fc.front, back: fc.back,
      difficulty: fc.difficulty || "intermediate", tags: fc.tags ? JSON.stringify(fc.tags) : null,
    });
    if (!error) fcCount++;
  }
  console.log(`Inserted ${fcCount} flashcards.`);

  // ─── QUIZ QUESTIONS ──────────────────────────────────────────────
  const quizMod = await loadModule("../src/data/seed/quiz-questions");
  const allQuizQuestions: SeedQuizQuestion[] = quizMod?.quizQuestions || [];
  let qqCount = 0;
  for (const qq of allQuizQuestions) {
    const bookId = qq.bookRef === "cross" ? null : bookIdMap[qq.bookRef] || null;
    const chapterId = qq.chapterRef ? chapterIdMap[qq.chapterRef] || null : null;
    const questionType = qq.question_type === "mc" ? "multiple_choice" : qq.question_type === "short" ? "short_answer" : qq.question_type;
    const { error } = await supabase.from("quiz_questions").insert({
      book_id: bookId, chapter_id: chapterId, question_type: questionType,
      question_text: qq.question_text, correct_answer: qq.correct_answer,
      option_a: qq.option_a || null, option_b: qq.option_b || null,
      option_c: qq.option_c || null, option_d: qq.option_d || null,
      explanation: qq.explanation || null, difficulty: qq.difficulty || "intermediate",
    });
    if (!error) qqCount++;
  }
  console.log(`Inserted ${qqCount} quiz questions.`);

  // ─── CONNECTIONS ─────────────────────────────────────────────────
  const connectionsMod = await loadModule("../src/data/seed/connections");
  const allConnections: SeedConnection[] = connectionsMod?.connections || [];
  let connCount = 0;
  for (const conn of allConnections) {
    const { error } = await supabase.from("connections").insert({
      title: conn.title, description: conn.description, sin_theme: conn.sin_theme,
      si_theme: conn.si_theme, relationship: conn.relationship, detailed_analysis: conn.detailed_analysis || null,
    });
    if (!error) connCount++;
  }
  console.log(`Inserted ${connCount} connections.`);

  // ─── SUMMARY ─────────────────────────────────────────────────────
  console.log("\n=== Seed Summary ===");
  const tables = ["books", "chapters", "concepts", "arguments", "quotes", "flashcards", "quiz_questions", "connections"];
  for (const table of tables) {
    const { count } = await supabase.from(table).select("*", { count: "exact", head: true });
    console.log(`  ${table}: ${count ?? 0}`);
  }
  console.log("\nDone! Supabase database seeded successfully.");
}

seed().catch((err: Error) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
