import { create } from "zustand";
import { checklistItemRepository } from "@/repositories/checklistItem.repository";
import { generateUUID } from "@/utils/helpers/uuid";
import { ChecklistItem } from "@/types/checklist";

type ItemStore = {
	items: ChecklistItem[];
	loadItems: (checklistId: string) => Promise<void>;
	addItem: (params: { checklistId: string; title: string; dueAt?: number | null }) => Promise<void>;
	toggleItem: (id: string, isDone: boolean) => Promise<void>;
};

export const useChecklistItemStore = create<ItemStore>((set) => ({
	items: [],

	loadItems: async (checklistId) => {
		const data = await checklistItemRepository.getByChecklist(checklistId);
		set({ items: data });
	},

	addItem: async ({ checklistId, title, dueAt }) => {
		const item: ChecklistItem = {
			id: generateUUID(),
			checklistId,
			title,
			isDone: false,
			dueAt: dueAt ?? null,
			createdAt: Date.now(),
		};

		await checklistItemRepository.insert(item);

		set((state) => ({
			items: [...state.items, item],
		}));
	},

	toggleItem: async (id, isDone) => {
		await checklistItemRepository.toggleDone(id, isDone);
		set((state) => ({
			items: state.items.map((i) => (i.id === id ? { ...i, isDone } : i)),
		}));
	},
}));
