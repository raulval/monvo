import { db } from "@/database";
import { Checklist } from "@/types/checklist";
import { ChecklistEntity } from "@/types/checklist-entity";

type ChecklistWithProgress = Checklist & {
	totalItems: number;
	completedItems: number;
};

export const checklistRepository = {
	async getActiveWithProgress(): Promise<ChecklistWithProgress[]> {
		return await db.getAllAsync<ChecklistWithProgress>(
			`
      SELECT
        c.id,
        c.title,
        c.description,
        c.type,
        c.status,
        c.icon,
        c.createdAt,

        COUNT(i.id) AS totalItems,
        COALESCE(
          SUM(CASE WHEN i.isDone = 1 THEN 1 ELSE 0 END),
          0
        ) AS completedItems

      FROM checklists c
      LEFT JOIN checklist_items i
        ON i.checklistId = c.id

      WHERE c.status = 'ACTIVE'
      GROUP BY c.id
      ORDER BY c.createdAt DESC
      `,
		);
	},

	async getActive(): Promise<ChecklistEntity[]> {
		return await db.getAllAsync<ChecklistEntity>(
			`SELECT *
       FROM checklists
       WHERE status = 'ACTIVE'
       ORDER BY createdAt DESC`,
		);
	},

	async insert(checklist: ChecklistEntity) {
		await db.runAsync(
			`INSERT INTO checklists (id, title, description, type, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
			checklist.id,
			checklist.title,
			checklist.description || null,
			checklist.type,
			checklist.status,
			checklist.createdAt,
		);
	},

	async archive(id: string) {
		await db.runAsync(`UPDATE checklists SET status = 'ARCHIVED' WHERE id = ?`, id);
	},

	async remove(id: string) {
		await db.runAsync(`DELETE FROM checklists WHERE id = ?`, id);
	},

	async getById(id: string): Promise<Checklist | null> {
		return await db.getFirstAsync<Checklist>(`SELECT * FROM checklists WHERE id = ?`, id);
	},

	async update(id: string, updates: Partial<ChecklistEntity>) {
		const keys = Object.keys(updates);
		if (keys.length === 0) return;

		const setClause = keys.map((key) => `${key} = ?`).join(", ");
		const values = [...Object.values(updates), id];

		await db.runAsync(`UPDATE checklists SET ${setClause} WHERE id = ?`, ...(values as any));
	},
};
