export type ChecklistStatus = "ACTIVE" | "ARCHIVED" | "COMPLETED";

export type ChecklistType = "EMPTY" | "TRAVEL" | "MOVING" | "MEETING" | "WEDDING";

export interface Checklist {
	id: string;
	title: string;
	description?: string;
	type: ChecklistType;
	icon: "plane" | "home" | "heart" | "default";
	gradient: string;
	totalItems: number;
	completedItems: number;
	progress: number; // 0 → 100
}

export type ChecklistItem = {
	id: string;
	checklistId: string;
	topicId?: string | null;
	title: string;
	isDone: boolean;
	dueAt?: number | null;
	notifiedAt?: number | null;
	createdAt: number;
};

export type ChecklistTopic = {
	id: string;
	checklistId: string;
	title: string;
	order: number;
	createdAt: number;
};
