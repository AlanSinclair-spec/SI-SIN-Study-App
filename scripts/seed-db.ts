/**
 * Legacy SQLite seed script - no longer used.
 *
 * The app has been migrated to:
 * - Static content files in src/data/content/ for books, chapters, concepts,
 *   flashcards, quiz questions, and connections
 * - Supabase for user data (auth, progress, notes, highlights, quiz results)
 *
 * To set up Supabase tables, run the SQL migrations in your Supabase dashboard.
 * Content data is loaded automatically from the static files.
 */

console.log(
  "This script is deprecated. Content is now served from static files in src/data/content/.\n" +
    "User data is stored in Supabase. See the project README for setup instructions."
);
