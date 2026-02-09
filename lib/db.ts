import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "guffs.db");

function ensureDataDir() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    ensureDataDir();
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    runMigrations(db);
  }
  return db;
}

function runMigrations(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS cocktails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      imagePath TEXT NOT NULL,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS memorabilia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      imagePath TEXT NOT NULL,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imagePath TEXT NOT NULL,
      caption TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  // Add optional submission columns if missing
  const submissionCols = database.prepare("PRAGMA table_info(submissions)").all() as { name: string }[];
  if (!submissionCols.some((c) => c.name === "guestName")) database.exec("ALTER TABLE submissions ADD COLUMN guestName TEXT");
  if (!submissionCols.some((c) => c.name === "comment")) database.exec("ALTER TABLE submissions ADD COLUMN comment TEXT");
  if (!submissionCols.some((c) => c.name === "status")) {
    database.exec("ALTER TABLE submissions ADD COLUMN status TEXT DEFAULT 'pending'");
    database.exec("UPDATE submissions SET status = 'pending' WHERE status IS NULL");
  }
  // Add optional cocktail columns if missing (SQLite has no IF NOT EXISTS for columns)
  const cocktailCols = database.prepare("PRAGMA table_info(cocktails)").all() as { name: string }[];
  const hasFriendName = cocktailCols.some((c) => c.name === "friendName");
  const hasIngredients = cocktailCols.some((c) => c.name === "ingredients");
  if (!hasFriendName) database.exec("ALTER TABLE cocktails ADD COLUMN friendName TEXT");
  if (!hasIngredients) database.exec("ALTER TABLE cocktails ADD COLUMN ingredients TEXT");
  database.exec(`
    CREATE TABLE IF NOT EXISTS homies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      imagePath TEXT,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

export type Cocktail = {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  sortOrder: number;
  createdAt: string;
  friendName: string | null;
  ingredients: string | null;
};

export type Memorabilia = {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  sortOrder: number;
  createdAt: string;
};

export type Submission = {
  id: number;
  imagePath: string;
  caption: string | null;
  createdAt: string;
  guestName: string | null;
  comment: string | null;
  status: "pending" | "approved" | "denied";
};

export type Homie = {
  id: number;
  name: string;
  title: string;
  description: string;
  imagePath: string | null;
  sortOrder: number;
  createdAt: string;
};

export function getCocktails(): Cocktail[] {
  return getDb().prepare("SELECT * FROM cocktails ORDER BY sortOrder ASC, id ASC").all() as Cocktail[];
}

export function getCocktailById(id: number): Cocktail | undefined {
  return getDb().prepare("SELECT * FROM cocktails WHERE id = ?").get(id) as Cocktail | undefined;
}

export function createCocktail(
  name: string,
  description: string,
  imagePath: string,
  sortOrder: number = 0,
  friendName: string | null = null,
  ingredients: string | null = null
): Cocktail {
  const stmt = getDb().prepare(
    "INSERT INTO cocktails (name, description, imagePath, sortOrder, friendName, ingredients) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const result = stmt.run(name, description, imagePath, sortOrder, friendName, ingredients);
  return getCocktailById(result.lastInsertRowid as number)!;
}

export function updateCocktail(
  id: number,
  data: {
    name?: string;
    description?: string;
    imagePath?: string;
    sortOrder?: number;
    friendName?: string | null;
    ingredients?: string | null;
  }
): void {
  const row = getCocktailById(id);
  if (!row) return;
  const name = data.name ?? row.name;
  const description = data.description ?? row.description;
  const imagePath = data.imagePath ?? row.imagePath;
  const sortOrder = data.sortOrder ?? row.sortOrder;
  const friendName = data.friendName !== undefined ? data.friendName : row.friendName;
  const ingredients = data.ingredients !== undefined ? data.ingredients : row.ingredients;
  getDb()
    .prepare(
      "UPDATE cocktails SET name = ?, description = ?, imagePath = ?, sortOrder = ?, friendName = ?, ingredients = ? WHERE id = ?"
    )
    .run(name, description, imagePath, sortOrder, friendName, ingredients, id);
}

export function deleteCocktail(id: number): void {
  getDb().prepare("DELETE FROM cocktails WHERE id = ?").run(id);
}

export function getMemorabilia(): Memorabilia[] {
  return getDb().prepare("SELECT * FROM memorabilia ORDER BY sortOrder ASC, id ASC").all() as Memorabilia[];
}

export function getMemorabiliaById(id: number): Memorabilia | undefined {
  return getDb().prepare("SELECT * FROM memorabilia WHERE id = ?").get(id) as Memorabilia | undefined;
}

export function createMemorabilia(title: string, description: string, imagePath: string, sortOrder: number = 0): Memorabilia {
  const stmt = getDb().prepare(
    "INSERT INTO memorabilia (title, description, imagePath, sortOrder) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(title, description, imagePath, sortOrder);
  return getMemorabiliaById(result.lastInsertRowid as number)!;
}

export function updateMemorabilia(
  id: number,
  data: { title?: string; description?: string; imagePath?: string; sortOrder?: number }
): void {
  const row = getMemorabiliaById(id);
  if (!row) return;
  const title = data.title ?? row.title;
  const description = data.description ?? row.description;
  const imagePath = data.imagePath ?? row.imagePath;
  const sortOrder = data.sortOrder ?? row.sortOrder;
  getDb().prepare("UPDATE memorabilia SET title = ?, description = ?, imagePath = ?, sortOrder = ? WHERE id = ?").run(title, description, imagePath, sortOrder, id);
}

export function deleteMemorabilia(id: number): void {
  getDb().prepare("DELETE FROM memorabilia WHERE id = ?").run(id);
}

export function getSubmissions(): Submission[] {
  return getDb().prepare("SELECT * FROM submissions ORDER BY createdAt DESC").all() as Submission[];
}

export function createSubmission(
  imagePath: string,
  caption: string | null = null,
  guestName: string | null = null,
  comment: string | null = null
): Submission {
  const stmt = getDb().prepare(
    "INSERT INTO submissions (imagePath, caption, guestName, comment, status) VALUES (?, ?, ?, ?, 'pending')"
  );
  const result = stmt.run(imagePath, caption, guestName, comment);
  return getDb().prepare("SELECT * FROM submissions WHERE id = ?").get(result.lastInsertRowid) as Submission;
}

export function updateSubmissionStatus(id: number, status: "pending" | "approved" | "denied"): void {
  getDb().prepare("UPDATE submissions SET status = ? WHERE id = ?").run(status, id);
}

export function getHomies(): Homie[] {
  return getDb().prepare("SELECT * FROM homies ORDER BY sortOrder ASC, id ASC").all() as Homie[];
}

export function getHomieById(id: number): Homie | undefined {
  return getDb().prepare("SELECT * FROM homies WHERE id = ?").get(id) as Homie | undefined;
}

export function createHomie(
  name: string,
  title: string,
  description: string,
  imagePath: string | null = null,
  sortOrder: number = 0
): Homie {
  const stmt = getDb().prepare(
    "INSERT INTO homies (name, title, description, imagePath, sortOrder) VALUES (?, ?, ?, ?, ?)"
  );
  const result = stmt.run(name, title, description, imagePath, sortOrder);
  return getHomieById(result.lastInsertRowid as number)!;
}

export function updateHomie(
  id: number,
  data: { name?: string; title?: string; description?: string; imagePath?: string | null; sortOrder?: number }
): void {
  const row = getHomieById(id);
  if (!row) return;
  const name = data.name ?? row.name;
  const title = data.title ?? row.title;
  const description = data.description ?? row.description;
  const imagePath = data.imagePath !== undefined ? data.imagePath : row.imagePath;
  const sortOrder = data.sortOrder ?? row.sortOrder;
  getDb()
    .prepare("UPDATE homies SET name = ?, title = ?, description = ?, imagePath = ?, sortOrder = ? WHERE id = ?")
    .run(name, title, description, imagePath, sortOrder, id);
}

export function deleteHomie(id: number): void {
  getDb().prepare("DELETE FROM homies WHERE id = ?").run(id);
}
