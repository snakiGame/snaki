import * as SQLite from "expo-sqlite";

export async function dbInt() {
  const db = await SQLite.openDatabaseAsync("snaki.db");

  await db.execAsync(`
  PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    score INTEGER NOT NULL,
    date TEXT NOT NULL
  `);
  return db
}
