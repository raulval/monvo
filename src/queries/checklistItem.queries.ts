import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checklistItemRepository } from "@/repositories/checklistItem.repository";
import { generateUUID } from "@/utils/helpers/uuid";
import { checklistTopicRepository } from "@/repositories/checklistTopic.repository";

export const itemKeys = {
	byChecklist: (checklistId: string) => ["items", checklistId] as const,
	reminders: ["items", "reminders"] as const,
};

export const topicKeys = {
	byChecklist: (checklistId: string) => ["topics", checklistId] as const,
};

export function useChecklistTopics(checklistId: string) {
	return useQuery({
		queryKey: topicKeys.byChecklist(checklistId),
		queryFn: () => checklistTopicRepository.getByChecklist(checklistId),
	});
}

export function useUpcomingReminders() {
	return useQuery({
		queryKey: itemKeys.reminders,
		queryFn: () => checklistItemRepository.getUpcomingReminders(),
	});
}

export function useChecklistItems(checklistId: string) {
	return useQuery({
		queryKey: ["items", checklistId],
		queryFn: () => checklistItemRepository.getByChecklist(checklistId),
	});
}

export function useAddItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			checklistId,
			title,
			dueAt,
		}: {
			checklistId: string;
			title: string;
			dueAt?: number | null;
		}) => {
			const item = {
				id: generateUUID(),
				checklistId,
				title,
				isDone: false,
				dueAt: dueAt ?? null,
				createdAt: Date.now(),
			};

			await checklistItemRepository.insert(item);
			return item;
		},

		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: itemKeys.byChecklist(variables.checklistId),
			});
		},
	});
}
