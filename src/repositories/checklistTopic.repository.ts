import { db } from "@/database";
import { ChecklistTopic } from "@/types/checklist";

export const checklistTopicRepository = {
	async getByChecklist(checklistId: string): Promise<ChecklistTopic[]> {
		return await db.getAllAsync<ChecklistTopic>(
			`SELECT * FROM checklist_topics
       WHERE checklistId = ?
       ORDER BY "order" ASC`,
			checklistId,
		);
	},

	async insert(topic: ChecklistTopic) {
		await db.runAsync(
			`INSERT INTO checklist_topics (id, checklistId, title, "order", createdAt)
       VALUES (?, ?, ?, ?, ?)`,
			topic.id,
			topic.checklistId,
			topic.title,
			topic.order,
			topic.createdAt,
		);
	},

	async update(id: string, title: string) {
		await db.runAsync(`UPDATE checklist_topics SET title = ? WHERE id = ?`, title, id);
	},

	async remove(id: string) {
		await db.runAsync(`DELETE FROM checklist_topics WHERE id = ?`, id);
	},
};
