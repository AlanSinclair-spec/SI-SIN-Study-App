import { unlinkSync, existsSync } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), "study-app.db");
const walPath = dbPath + "-wal";
const shmPath = dbPath + "-shm";

for (const p of [dbPath, walPath, shmPath]) {
  if (existsSync(p)) {
    unlinkSync(p);
    console.log(`Deleted: ${p}`);
  }
}

console.log("Database files removed. Run 'npm run seed' to recreate.");
