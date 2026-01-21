import * as SQLite from "expo-sqlite";

export async function initializeDatabase(db: SQLite.SQLiteDatabase) {
	try {
		await db.execAsync(`PRAGMA foreign_keys = ON;`);

		await db.execAsync(`
      CREATE TABLE IF NOT EXISTS checklists (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        status TEXT NOT NULL,
        icon TEXT,
        createdAt INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS checklist_topics (
        id TEXT PRIMARY KEY NOT NULL,
        checklistId TEXT NOT NULL,
        title TEXT NOT NULL,
        "order" INTEGER NOT NULL,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY (checklistId) REFERENCES checklists(id)
          ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS checklist_items (
        id TEXT PRIMARY KEY NOT NULL,
        checklistId TEXT NOT NULL,
        topicId TEXT,
        title TEXT NOT NULL,
        isDone INTEGER NOT NULL,
        dueAt INTEGER,
        notifiedAt INTEGER,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY (checklistId) REFERENCES checklists(id)
          ON DELETE CASCADE,
        FOREIGN KEY (topicId) REFERENCES checklist_topics(id)
          ON DELETE SET NULL
      );
    `);

		// Migrações manuais para bancos de dados já existentes
		try {
			await db.execAsync(`ALTER TABLE checklists ADD COLUMN description TEXT;`);
		} catch (e) {
			// Coluna já existe
		}

		// Criação de índices (em comandos separados para evitar que falhas em um parem os outros)
		await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_topics_checklist ON checklist_topics (checklistId);
      CREATE INDEX IF NOT EXISTS idx_items_topic ON checklist_items (topicId);
      CREATE INDEX IF NOT EXISTS idx_items_dueAt ON checklist_items (dueAt);
    `);
		console.log("Database initialized successfully");
	} catch (error) {
		console.error("Error initializing database:", error);
	}
}
