import { ChecklistIconName } from "@/utils/helpers/checklistIcons";

export interface TemplateTopic {
	titleKey: string;
	items: { titleKey: string; withReminder?: boolean }[];
}

export interface ChecklistTemplate {
	id: string;
	titleKey: string;
	descriptionKey: string;
	icon: ChecklistIconName;
	gradient: string; // Cor base ou Hex para o card
	topics: TemplateTopic[];
}

export const CHECKLIST_TEMPLATES: Record<string, ChecklistTemplate> = {
	TRAVEL: {
		id: "TRAVEL",
		titleKey: "screens.home.templates.travel.title",
		descriptionKey: "screens.home.templates.travel.desc",
		icon: "plane",
		gradient: "#3B82F6", // Blue-500
		topics: [
			{
				titleKey: "screens.home.templates.travel.topics.docs",
				items: [
					{ titleKey: "screens.home.templates.travel.items.passport", withReminder: true },
					{ titleKey: "screens.home.templates.travel.items.insurance", withReminder: false },
					{ titleKey: "screens.home.templates.travel.items.currency", withReminder: false },
				],
			},
			{
				titleKey: "screens.home.templates.travel.topics.packing",
				items: [
					{ titleKey: "screens.home.templates.travel.items.charger", withReminder: false },
					{ titleKey: "screens.home.templates.travel.items.ticket", withReminder: true },
				],
			},
		],
	},
	MOVING: {
		id: "MOVING",
		titleKey: "screens.home.templates.moving.title",
		descriptionKey: "screens.home.templates.moving.desc",
		icon: "home",
		gradient: "#F59E0B", // Amber-500
		topics: [
			{
				titleKey: "screens.home.templates.moving.topics.admin",
				items: [
					{ titleKey: "screens.home.templates.moving.items.address", withReminder: true },
					{ titleKey: "screens.home.templates.moving.items.utilities", withReminder: true },
				],
			},
			{
				titleKey: "screens.home.templates.moving.topics.packing",
				items: [
					{ titleKey: "screens.home.templates.moving.items.boxes", withReminder: false },
					{ titleKey: "screens.home.templates.moving.items.label", withReminder: false },
				],
			},
		],
	},
	WEDDING: {
		id: "WEDDING",
		titleKey: "screens.home.templates.wedding.title",
		descriptionKey: "screens.home.templates.wedding.desc",
		icon: "heart",
		gradient: "#EC4899", // Pink-500
		topics: [
			{
				titleKey: "screens.home.templates.wedding.topics.legal",
				items: [{ titleKey: "screens.home.templates.wedding.items.registry", withReminder: true }],
			},
			{
				titleKey: "screens.home.templates.wedding.topics.vendors",
				items: [
					{ titleKey: "screens.home.templates.wedding.items.photo", withReminder: false },
					{ titleKey: "screens.home.templates.wedding.items.catering", withReminder: false },
				],
			},
		],
	},
};
