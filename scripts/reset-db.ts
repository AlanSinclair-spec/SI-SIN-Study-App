/**
 * DEPRECATED: The app no longer uses SQLite.
 *
 * Content data is served from static TypeScript modules in /src/data/content/.
 * User data is stored in Supabase (see /supabase/migrations/ for the schema).
 *
 * To reset user data, use the Supabase dashboard or CLI.
 */
console.log("This script is deprecated. The app now uses Supabase for user data.");
console.log("Content data lives in /src/data/content/ as static TypeScript modules.");
console.log("See /supabase/migrations/001_initial.sql for the database schema.");
