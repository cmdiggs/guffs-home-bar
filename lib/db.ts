import { createClient, type Client as TursoClient } from "@libsql/client";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "guffs.db");
const isProduction = process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN;

function ensureDataDir() {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

let sqliteDb: Database.Database | null = null;
let tursoDb: TursoClient | null = null;

function getDb() {
  if (isProduction) {
    if (!tursoDb) {
      tursoDb = createClient({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      });
      runMigrationsTurso(tursoDb);
    }
    return tursoDb;
  } else {
    if (!sqliteDb) {
      ensureDataDir();
      sqliteDb = new Database(dbPath);
      sqliteDb.pragma("journal_mode = WAL");
      runMigrationsSqlite(sqliteDb);
    }
    return sqliteDb;
  }
}

function runMigrationsSqlite(database: Database.Database) {
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

async function runMigrationsTurso(database: TursoClient) {
  await database.batch([
    `CREATE TABLE IF NOT EXISTS cocktails (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      imagePath TEXT NOT NULL,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      friendName TEXT,
      ingredients TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS memorabilia (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      imagePath TEXT NOT NULL,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imagePath TEXT NOT NULL,
      caption TEXT,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      guestName TEXT,
      comment TEXT,
      status TEXT DEFAULT 'pending'
    )`,
    `CREATE TABLE IF NOT EXISTS homies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      imagePath TEXT,
      sortOrder INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
  ], "write");
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

export async function getCocktails(): Promise<Cocktail[]> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute("SELECT * FROM cocktails ORDER BY sortOrder ASC, id ASC");
    return result.rows as unknown as Cocktail[];
  }
  return (db as Database.Database).prepare("SELECT * FROM cocktails ORDER BY sortOrder ASC, id ASC").all() as Cocktail[];
}

export async function getCocktailById(id: number): Promise<Cocktail | undefined> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute({ sql: "SELECT * FROM cocktails WHERE id = ?", args: [id] });
    return result.rows[0] as unknown as Cocktail | undefined;
  }
  return (db as Database.Database).prepare("SELECT * FROM cocktails WHERE id = ?").get(id) as Cocktail | undefined;
}

export async function createCocktail(
  name: string,
  description: string,
  imagePath: string,
  sortOrder: number = 0,
  friendName: string | null = null,
  ingredients: string | null = null
): Promise<Cocktail> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute({
      sql: "INSERT INTO cocktails (name, description, imagePath, sortOrder, friendName, ingredients) VALUES (?, ?, ?, ?, ?, ?) RETURNING *",
      args: [name, description, imagePath, sortOrder, friendName, ingredients]
    });
    return result.rows[0] as unknown as Cocktail;
  }
  const stmt = (db as Database.Database).prepare(
    "INSERT INTO cocktails (name, description, imagePath, sortOrder, friendName, ingredients) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const result = stmt.run(name, description, imagePath, sortOrder, friendName, ingredients);
  return (await getCocktailById(result.lastInsertRowid as number))!;
}

export async function updateCocktail(
  id: number,
  data: {
    name?: string;
    description?: string;
    imagePath?: string;
    sortOrder?: number;
    friendName?: string | null;
    ingredients?: string | null;
  }
): Promise<void> {
  const row = await getCocktailById(id);
  if (!row) return;
  const name = data.name ?? row.name;
  const description = data.description ?? row.description;
  const imagePath = data.imagePath ?? row.imagePath;
  const sortOrder = data.sortOrder ?? row.sortOrder;
  const friendName = data.friendName !== undefined ? data.friendName : row.friendName;
  const ingredients = data.ingredients !== undefined ? data.ingredients : row.ingredients;

  const db = getDb();
  if (isProduction) {
    await (db as TursoClient).execute({
      sql: "UPDATE cocktails SET name = ?, description = ?, imagePath = ?, sortOrder = ?, friendName = ?, ingredients = ? WHERE id = ?",
      args: [name, description, imagePath, sortOrder, friendName, ingredients, id]
    });
  } else {
    (db as Database.Database)
      .prepare("UPDATE cocktails SET name = ?, description = ?, imagePath = ?, sortOrder = ?, friendName = ?, ingredients = ? WHERE id = ?")
      .run(name, description, imagePath, sortOrder, friendName, ingredients, id);
  }
}

export async function deleteCocktail(id: number): Promise<void> {
  const db = getDb();
  if (isProduction) {
    await (db as TursoClient).execute({ sql: "DELETE FROM cocktails WHERE id = ?", args: [id] });
  } else {
    (db as Database.Database).prepare("DELETE FROM cocktails WHERE id = ?").run(id);
  }
}

export async function getMemorabilia(): Promise<Memorabilia[]> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute("SELECT * FROM memorabilia ORDER BY sortOrder ASC, id ASC");
    return result.rows as unknown as Memorabilia[];
  }
  return (db as Database.Database).prepare("SELECT * FROM memorabilia ORDER BY sortOrder ASC, id ASC").all() as Memorabilia[];
}

export async function getMemorabiliaById(id: number): Promise<Memorabilia | undefined> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute({ sql: "SELECT * FROM memorabilia WHERE id = ?", args: [id] });
    return result.rows[0] as unknown as Memorabilia | undefined;
  }
  return (db as Database.Database).prepare("SELECT * FROM memorabilia WHERE id = ?").get(id) as Memorabilia | undefined;
}

export async function createMemorabilia(title: string, description: string, imagePath: string, sortOrder: number = 0): Promise<Memorabilia> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute({
      sql: "INSERT INTO memorabilia (title, description, imagePath, sortOrder) VALUES (?, ?, ?, ?) RETURNING *",
      args: [title, description, imagePath, sortOrder]
    });
    return result.rows[0] as unknown as Memorabilia;
  }
  const stmt = (db as Database.Database).prepare(
    "INSERT INTO memorabilia (title, description, imagePath, sortOrder) VALUES (?, ?, ?, ?)"
  );
  const result = stmt.run(title, description, imagePath, sortOrder);
  return (await getMemorabiliaById(result.lastInsertRowid as number))!;
}

export async function updateMemorabilia(
  id: number,
  data: { title?: string; description?: string; imagePath?: string; sortOrder?: number }
): Promise<void> {
  const row = await getMemorabiliaById(id);
  if (!row) return;
  const title = data.title ?? row.title;
  const description = data.description ?? row.description;
  const imagePath = data.imagePath ?? row.imagePath;
  const sortOrder = data.sortOrder ?? row.sortOrder;

  const db = getDb();
  if (isProduction) {
    await (db as TursoClient).execute({
      sql: "UPDATE memorabilia SET title = ?, description = ?, imagePath = ?, sortOrder = ? WHERE id = ?",
      args: [title, description, imagePath, sortOrder, id]
    });
  } else {
    (db as Database.Database).prepare("UPDATE memorabilia SET title = ?, description = ?, imagePath = ?, sortOrder = ? WHERE id = ?").run(title, description, imagePath, sortOrder, id);
  }
}

export async function deleteMemorabilia(id: number): Promise<void> {
  const db = getDb();
  if (isProduction) {
    await (db as TursoClient).execute({ sql: "DELETE FROM memorabilia WHERE id = ?", args: [id] });
  } else {
    (db as Database.Database).prepare("DELETE FROM memorabilia WHERE id = ?").run(id);
  }
}

export async function getSubmissions(): Promise<Submission[]> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute("SELECT * FROM submissions ORDER BY createdAt DESC");
    return result.rows as unknown as Submission[];
  }
  return (db as Database.Database).prepare("SELECT * FROM submissions ORDER BY createdAt DESC").all() as Submission[];
}

export async function createSubmission(
  imagePath: string,
  caption: string | null = null,
  guestName: string | null = null,
  comment: string | null = null
): Promise<Submission> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute({
      sql: "INSERT INTO submissions (imagePath, caption, guestName, comment, status) VALUES (?, ?, ?, ?, 'pending') RETURNING *",
      args: [imagePath, caption, guestName, comment]
    });
    return result.rows[0] as unknown as Submission;
  }
  const stmt = (db as Database.Database).prepare(
    "INSERT INTO submissions (imagePath, caption, guestName, comment, status) VALUES (?, ?, ?, ?, 'pending')"
  );
  const result = stmt.run(imagePath, caption, guestName, comment);
  return (db as Database.Database).prepare("SELECT * FROM submissions WHERE id = ?").get(result.lastInsertRowid) as Submission;
}

export async function updateSubmissionStatus(id: number, status: "pending" | "approved" | "denied"): Promise<void> {
  const db = getDb();
  if (isProduction) {
    await (db as TursoClient).execute({ sql: "UPDATE submissions SET status = ? WHERE id = ?", args: [status, id] });
  } else {
    (db as Database.Database).prepare("UPDATE submissions SET status = ? WHERE id = ?").run(status, id);
  }
}

export async function getApprovedSubmissions(): Promise<Submission[]> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute("SELECT * FROM submissions WHERE status = 'approved' ORDER BY createdAt DESC");
    return result.rows as unknown as Submission[];
  }
  return (db as Database.Database)
    .prepare("SELECT * FROM submissions WHERE status = 'approved' ORDER BY createdAt DESC")
    .all() as Submission[];
}

export async function getHomies(): Promise<Homie[]> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute("SELECT * FROM homies ORDER BY sortOrder ASC, id ASC");
    return result.rows as unknown as Homie[];
  }
  return (db as Database.Database).prepare("SELECT * FROM homies ORDER BY sortOrder ASC, id ASC").all() as Homie[];
}

export async function getHomieById(id: number): Promise<Homie | undefined> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute({ sql: "SELECT * FROM homies WHERE id = ?", args: [id] });
    return result.rows[0] as unknown as Homie | undefined;
  }
  return (db as Database.Database).prepare("SELECT * FROM homies WHERE id = ?").get(id) as Homie | undefined;
}

export async function createHomie(
  name: string,
  title: string,
  description: string,
  imagePath: string | null = null,
  sortOrder: number = 0
): Promise<Homie> {
  const db = getDb();
  if (isProduction) {
    const result = await (db as TursoClient).execute({
      sql: "INSERT INTO homies (name, title, description, imagePath, sortOrder) VALUES (?, ?, ?, ?, ?) RETURNING *",
      args: [name, title, description, imagePath, sortOrder]
    });
    return result.rows[0] as unknown as Homie;
  }
  const stmt = (db as Database.Database).prepare(
    "INSERT INTO homies (name, title, description, imagePath, sortOrder) VALUES (?, ?, ?, ?, ?)"
  );
  const result = stmt.run(name, title, description, imagePath, sortOrder);
  return (await getHomieById(result.lastInsertRowid as number))!;
}

export async function updateHomie(
  id: number,
  data: { name?: string; title?: string; description?: string; imagePath?: string | null; sortOrder?: number }
): Promise<void> {
  const row = await getHomieById(id);
  if (!row) return;
  const name = data.name ?? row.name;
  const title = data.title ?? row.title;
  const description = data.description ?? row.description;
  const imagePath = data.imagePath !== undefined ? data.imagePath : row.imagePath;
  const sortOrder = data.sortOrder ?? row.sortOrder;

  const db = getDb();
  if (isProduction) {
    await (db as TursoClient).execute({
      sql: "UPDATE homies SET name = ?, title = ?, description = ?, imagePath = ?, sortOrder = ? WHERE id = ?",
      args: [name, title, description, imagePath, sortOrder, id]
    });
  } else {
    (db as Database.Database)
      .prepare("UPDATE homies SET name = ?, title = ?, description = ?, imagePath = ?, sortOrder = ? WHERE id = ?")
      .run(name, title, description, imagePath, sortOrder, id);
  }
}

export async function deleteHomie(id: number): Promise<void> {
  const db = getDb();
  if (isProduction) {
    await (db as TursoClient).execute({ sql: "DELETE FROM homies WHERE id = ?", args: [id] });
  } else {
    (db as Database.Database).prepare("DELETE FROM homies WHERE id = ?").run(id);
  }
}
