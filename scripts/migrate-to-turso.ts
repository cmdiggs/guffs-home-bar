import Database from "better-sqlite3";
import { createClient } from "@libsql/client";
import path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const dbPath = path.join(process.cwd(), "data", "guffs.db");

async function migrate() {
  console.log("Starting migration from local SQLite to Turso...\n");

  // Connect to local SQLite
  const localDb = new Database(dbPath);

  // Connect to Turso
  const tursoDb = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    // Migrate cocktails
    const cocktails = localDb.prepare("SELECT * FROM cocktails").all();
    console.log(`Found ${cocktails.length} cocktails to migrate`);
    for (const cocktail of cocktails as any[]) {
      await tursoDb.execute({
        sql: "INSERT INTO cocktails (name, description, imagePath, sortOrder, friendName, ingredients, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        args: [cocktail.name, cocktail.description, cocktail.imagePath, cocktail.sortOrder, cocktail.friendName, cocktail.ingredients, cocktail.createdAt]
      });
      console.log(`✓ Migrated cocktail: ${cocktail.name}`);
    }

    // Migrate memorabilia
    const memorabilia = localDb.prepare("SELECT * FROM memorabilia").all();
    console.log(`\nFound ${memorabilia.length} memorabilia items to migrate`);
    for (const item of memorabilia as any[]) {
      await tursoDb.execute({
        sql: "INSERT INTO memorabilia (title, description, imagePath, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?)",
        args: [item.title, item.description, item.imagePath, item.sortOrder, item.createdAt]
      });
      console.log(`✓ Migrated memorabilia: ${item.title}`);
    }

    // Migrate homies
    const homies = localDb.prepare("SELECT * FROM homies").all();
    console.log(`\nFound ${homies.length} homies to migrate`);
    for (const homie of homies as any[]) {
      await tursoDb.execute({
        sql: "INSERT INTO homies (name, title, description, imagePath, sortOrder, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
        args: [homie.name, homie.title, homie.description, homie.imagePath, homie.sortOrder, homie.createdAt]
      });
      console.log(`✓ Migrated homie: ${homie.name}`);
    }

    // Migrate submissions
    const submissions = localDb.prepare("SELECT * FROM submissions").all();
    console.log(`\nFound ${submissions.length} submissions to migrate`);
    for (const submission of submissions as any[]) {
      await tursoDb.execute({
        sql: "INSERT INTO submissions (imagePath, caption, guestName, comment, status, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
        args: [submission.imagePath, submission.caption, submission.guestName, submission.comment, submission.status, submission.createdAt]
      });
      console.log(`✓ Migrated submission #${submission.id}`);
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    throw error;
  } finally {
    localDb.close();
  }
}

migrate().catch(console.error);
