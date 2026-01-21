import { ChecklistStatus, ChecklistType } from "./checklist";

export interface ChecklistEntity {
	id: string;
	title: string;
	description?: string;
	type: ChecklistType;
	status: ChecklistStatus;
	createdAt: number;
}
