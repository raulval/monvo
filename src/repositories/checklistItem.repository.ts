import { db } from "@/database";
import { ChecklistItem } from "@/types/checklist";

export const checklistItemRepository = {
	async getByChecklist(checklistId: string): Promise<ChecklistItem[]> {
		return await db.getAllAsync<ChecklistItem>(
			`SELECT * FROM checklist_items 
       WHERE checklistId = ?
       ORDER BY createdAt ASC`,
			checklistId,
		);
	},

	async getUpcomingReminders(): Promise<(ChecklistItem & { checklistTitle: string })[]> {
		return await db.getAllAsync<ChecklistItem & { checklistTitle: string }>(
			`SELECT ci.*, c.title as checklistTitle 
       FROM checklist_items ci
       JOIN checklists c ON ci.checklistId = c.id
       WHERE ci.dueAt IS NOT NULL
         AND ci.isDone = 0
       ORDER BY ci.dueAt ASC`,
		);
	},

	async insert(item: ChecklistItem) {
		await db.runAsync(
			`INSERT INTO checklist_items
      (id, checklistId, topicId, title, isDone, dueAt, notifiedAt, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			item.id,
			item.checklistId,
			item.topicId ?? null,
			item.title,
			item.isDone ? 1 : 0,
			item.dueAt ?? null,
			item.notifiedAt ?? null,
			item.createdAt,
		);
	},

	async toggleDone(id: string, isDone: boolean) {
		await db.runAsync(`UPDATE checklist_items SET isDone = ? WHERE id = ?`, isDone ? 1 : 0, id);
	},

	async updateDueDate(id: string, dueAt: number | null) {
		await db.runAsync(`UPDATE checklist_items SET dueAt = ? WHERE id = ?`, dueAt, id);
	},

	async update(id: string, updates: Partial<ChecklistItem>) {
		const keys = Object.keys(updates);
		if (keys.length === 0) return;

		const setClause = keys.map((key) => `${key} = ?`).join(", ");
		const values = [...Object.values(updates), id];

		await db.runAsync(`UPDATE checklist_items SET ${setClause} WHERE id = ?`, ...(values as any));
	},

	async remove(id: string) {
		await db.runAsync(`DELETE FROM checklist_items WHERE id = ?`, id);
	},
};
