import Database from "better-sqlite3";
import path from "path";
import { initializeSchema } from "../src/lib/schema";
import { books } from "../src/data/seed/books";
import { users } from "../src/data/seed/users";

// Dynamic imports to handle missing files gracefully
async function loadModule(modulePath: string) {
  try {
    return await import(modulePath);
  } catch {
    console.warn(`  Warning: Could not load ${modulePath}`);
    return null;
  }
}

async function seed() {
  const dbPath = path.join(process.cwd(), "study-app.db");
  console.log(`Seeding database at: ${dbPath}`);

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  // Initialize schema
  initializeSchema(db);
  console.log("Schema initialized.");

  // Clear existing data
  const tables = [
    "tutor_conversations",
    "quiz_answers",
    "quizzes",
    "quiz_questions",
    "user_flashcard_state",
    "flashcard_reviews",
    "flashcards",
    "connections",
    "quotes",
    "arguments",
    "concepts",
    "chapters",
    "study_sessions",
    "users",
    "books",
  ];
  for (const table of tables) {
    db.prepare(`DELETE FROM ${table}`).run();
  }
  console.log("Cleared existing data.");

  // ─── USERS ───────────────────────────────────────────────────────
  const insertUser = db.prepare("INSERT INTO users (name) VALUES (?)");
  for (const user of users) {
    insertUser.run(user.name);
  }
  console.log(`Inserted ${users.length} users.`);

  // ─── BOOKS ───────────────────────────────────────────────────────
  const insertBook = db.prepare(
    "INSERT INTO books (title, author, slug, description, year) VALUES (?, ?, ?, ?, ?)"
  );
  const bookIdMap: Record<string, number> = {};
  for (const book of books) {
    const result = insertBook.run(
      book.title,
      book.author,
      book.slug,
      book.description,
      book.year
    );
    bookIdMap[book.ref] = Number(result.lastInsertRowid);
  }
  console.log(`Inserted ${books.length} books.`);

  // ─── CHAPTERS ────────────────────────────────────────────────────
  const insertChapter = db.prepare(
    "INSERT INTO chapters (book_id, number, title, slug, summary) VALUES (?, ?, ?, ?, ?)"
  );
  const chapterIdMap: Record<string, number> = {};

  const sinChaptersMod = await loadModule("../src/data/seed/sin-chapters");
  const siChaptersMod = await loadModule("../src/data/seed/si-chapters");

  const allChapters = [
    ...(sinChaptersMod?.sinChapters || []).map((c: any) => ({ ...c, bookRef: "sin" })),
    ...(siChaptersMod?.siChapters || []).map((c: any) => ({ ...c, bookRef: "si" })),
  ];

  for (const ch of allChapters) {
    const bookId = bookIdMap[ch.bookRef];
    if (!bookId) continue;
    const result = insertChapter.run(bookId, ch.number, ch.title, ch.slug, ch.summary || null);
    chapterIdMap[ch.ref] = Number(result.lastInsertRowid);
  }
  console.log(`Inserted ${allChapters.length} chapters.`);

  // ─── CONCEPTS ────────────────────────────────────────────────────
  const insertConcept = db.prepare(
    "INSERT INTO concepts (chapter_id, title, description, importance) VALUES (?, ?, ?, ?)"
  );
  const conceptIdMap: Record<string, number> = {};

  const sinConceptsMod = await loadModule("../src/data/seed/sin-concepts");
  const siConceptsMod = await loadModule("../src/data/seed/si-concepts");

  const allConcepts = [
    ...(sinConceptsMod?.sinConcepts || []),
    ...(siConceptsMod?.siConcepts || []),
  ];

  for (const concept of allConcepts) {
    const chapterId = chapterIdMap[concept.chapterRef];
    if (!chapterId) continue;
    const validImportance = ["core", "supporting", "supplementary"].includes(concept.importance) ? concept.importance : "core";
    const result = insertConcept.run(
      chapterId,
      concept.title,
      concept.description,
      validImportance
    );
    conceptIdMap[concept.ref] = Number(result.lastInsertRowid);
  }
  console.log(`Inserted ${allConcepts.length} concepts.`);

  // ─── ARGUMENTS ───────────────────────────────────────────────────
  const insertArgument = db.prepare(
    "INSERT INTO arguments (concept_id, title, description) VALUES (?, ?, ?)"
  );

  const sinArgsMod = await loadModule("../src/data/seed/sin-arguments");
  const siArgsMod = await loadModule("../src/data/seed/si-arguments");

  const allArguments = [
    ...(sinArgsMod?.sinArguments || []),
    ...(siArgsMod?.siArguments || []),
  ];

  let argCount = 0;
  for (const arg of allArguments) {
    const conceptId = conceptIdMap[arg.conceptRef];
    if (!conceptId) continue;
    insertArgument.run(conceptId, arg.title, arg.description);
    argCount++;
  }
  console.log(`Inserted ${argCount} arguments.`);

  // ─── QUOTES ──────────────────────────────────────────────────────
  const insertQuote = db.prepare(
    "INSERT INTO quotes (chapter_id, text, context) VALUES (?, ?, ?)"
  );

  const sinQuotesMod = await loadModule("../src/data/seed/sin-quotes");
  const siQuotesMod = await loadModule("../src/data/seed/si-quotes");

  const allQuotes = [
    ...(sinQuotesMod?.sinQuotes || []),
    ...(siQuotesMod?.siQuotes || []),
  ];

  let quoteCount = 0;
  for (const quote of allQuotes) {
    const chapterId = chapterIdMap[quote.chapterRef];
    if (!chapterId) continue;
    insertQuote.run(chapterId, quote.text, quote.context || null);
    quoteCount++;
  }
  console.log(`Inserted ${quoteCount} quotes.`);

  // ─── FLASHCARDS ──────────────────────────────────────────────────
  const insertFlashcard = db.prepare(
    "INSERT INTO flashcards (book_id, chapter_id, concept_id, front, back, difficulty, tags) VALUES (?, ?, ?, ?, ?, ?, ?)"
  );

  const sinFlashcardsMod = await loadModule("../src/data/seed/flashcards-sin");
  const siFlashcardsMod = await loadModule("../src/data/seed/flashcards-si");

  const allFlashcards = [
    ...(sinFlashcardsMod?.sinFlashcards || []),
    ...(siFlashcardsMod?.siFlashcards || []),
  ];

  let fcCount = 0;
  for (const fc of allFlashcards) {
    const bookId = bookIdMap[fc.bookRef];
    if (!bookId) continue;
    const chapterId = fc.chapterRef ? chapterIdMap[fc.chapterRef] || null : null;
    insertFlashcard.run(
      bookId,
      chapterId,
      null, // concept_id - would need conceptRef mapping
      fc.front,
      fc.back,
      fc.difficulty || "intermediate",
      fc.tags ? JSON.stringify(fc.tags) : null
    );
    fcCount++;
  }
  console.log(`Inserted ${fcCount} flashcards.`);

  // ─── QUIZ QUESTIONS ──────────────────────────────────────────────
  const insertQuizQuestion = db.prepare(
    `INSERT INTO quiz_questions (book_id, chapter_id, question_type, question_text, correct_answer, option_a, option_b, option_c, option_d, explanation, difficulty)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  const quizMod = await loadModule("../src/data/seed/quiz-questions");
  const allQuizQuestions = quizMod?.quizQuestions || [];

  let qqCount = 0;
  for (const qq of allQuizQuestions) {
    const bookId = qq.bookRef === "cross" ? null : bookIdMap[qq.bookRef] || null;
    const chapterId = qq.chapterRef ? chapterIdMap[qq.chapterRef] || null : null;
    const questionType = qq.question_type === "mc" ? "multiple_choice" : qq.question_type === "short" ? "short_answer" : qq.question_type;
    insertQuizQuestion.run(
      bookId,
      chapterId,
      questionType,
      qq.question_text,
      qq.correct_answer,
      qq.option_a || null,
      qq.option_b || null,
      qq.option_c || null,
      qq.option_d || null,
      qq.explanation || null,
      qq.difficulty || "intermediate"
    );
    qqCount++;
  }
  console.log(`Inserted ${qqCount} quiz questions.`);

  // ─── CONNECTIONS ─────────────────────────────────────────────────
  const insertConnection = db.prepare(
    `INSERT INTO connections (title, description, sin_theme, si_theme, relationship, detailed_analysis)
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  const connectionsMod = await loadModule("../src/data/seed/connections");
  const allConnections = connectionsMod?.connections || [];

  for (const conn of allConnections) {
    insertConnection.run(
      conn.title,
      conn.description,
      conn.sin_theme,
      conn.si_theme,
      conn.relationship,
      conn.detailed_analysis || null
    );
  }
  console.log(`Inserted ${allConnections.length} connections.`);

  // ─── SUMMARY ─────────────────────────────────────────────────────
  console.log("\n=== Seed Summary ===");
  const counts = [
    ["users", db.prepare("SELECT COUNT(*) as c FROM users").get()],
    ["books", db.prepare("SELECT COUNT(*) as c FROM books").get()],
    ["chapters", db.prepare("SELECT COUNT(*) as c FROM chapters").get()],
    ["concepts", db.prepare("SELECT COUNT(*) as c FROM concepts").get()],
    ["arguments", db.prepare("SELECT COUNT(*) as c FROM arguments").get()],
    ["quotes", db.prepare("SELECT COUNT(*) as c FROM quotes").get()],
    ["flashcards", db.prepare("SELECT COUNT(*) as c FROM flashcards").get()],
    ["quiz_questions", db.prepare("SELECT COUNT(*) as c FROM quiz_questions").get()],
    ["connections", db.prepare("SELECT COUNT(*) as c FROM connections").get()],
  ];
  for (const [name, row] of counts) {
    console.log(`  ${name}: ${(row as { c: number }).c}`);
  }

  db.close();
  console.log("\nDone! Database seeded successfully.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
