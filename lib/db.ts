import * as SQLite from "expo-sqlite";

export async function dbInit() {
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

// export async function insertScore(){
//   const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'aaa', 100);
// }