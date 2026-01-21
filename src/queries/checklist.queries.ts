import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checklistRepository } from "@/repositories/checklist.repository";
import { checklistTopicRepository } from "@/repositories/checklistTopic.repository";
import { checklistItemRepository } from "@/repositories/checklistItem.repository";
import { CHECKLIST_TEMPLATES } from "@/constants/checklistTemplates";
import { generateUUID } from "@/utils/helpers/uuid";
import i18next from "i18next";

export const checklistKeys = {
	all: ["checklists"] as const,
};

export function useChecklists() {
	return useQuery({
		queryKey: checklistKeys.all,
		queryFn: () => checklistRepository.getActiveWithProgress(), // Sua query SQL com contagem de itens
	});
}

export function useCreateChecklistMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ templateId, customTitle }: { templateId: string; customTitle?: string }) => {
			const checklistId = generateUUID();

			// Se for do zero (EMPTY)
			if (templateId === "EMPTY") {
				await checklistRepository.insert({
					id: checklistId,
					title: customTitle || i18next.t("screens.home.header.new_checklist"),
					description: undefined,
					type: "EMPTY",
					status: "ACTIVE",
					createdAt: Date.now(),
				});
				return checklistId;
			}

			// Se for Template
			const template = CHECKLIST_TEMPLATES[templateId as keyof typeof CHECKLIST_TEMPLATES];

			await checklistRepository.insert({
				id: checklistId,
				title: i18next.t(template.titleKey),
				description: i18next.t(template.descriptionKey),
				type: templateId as any,
				status: "ACTIVE",
				createdAt: Date.now(),
			});

			// Inserção em Cascata
			for (const [tIdx, topic] of template.topics.entries()) {
				const topicId = generateUUID();
				await checklistTopicRepository.insert({
					id: topicId,
					checklistId,
					title: i18next.t(topic.titleKey),
					order: tIdx,
					createdAt: Date.now(),
				});

				for (const item of topic.items) {
					await checklistItemRepository.insert({
						id: generateUUID(),
						checklistId,
						topicId,
						title: i18next.t(item.titleKey),
						isDone: false,
						createdAt: Date.now(),
					});
				}
			}
			return checklistId;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: checklistKeys.all });
		},
	});
}

export function useChecklistDetails(id: string) {
	return useQuery({
		queryKey: [...checklistKeys.all, "details", id],
		queryFn: async () => {
			const [checklist, topics, items] = await Promise.all([
				checklistRepository.getById(id),
				checklistTopicRepository.getByChecklist(id),
				checklistItemRepository.getByChecklist(id),
			]);

			if (!checklist) return null;

			// Montar a estrutura hierárquica
			const topicsWithItems = topics.map((topic) => ({
				...topic,
				items: items.filter((i) => i.topicId === topic.id),
			}));

			// Itens órfãos (se houver)
			const orphanItems = items.filter((i) => !i.topicId);

			// Calcular progresso
			const totalItems = items.length;
			const completedItems = items.filter((i) => i.isDone).length;
			const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

			return {
				...checklist,
				totalItems,
				completedItems,
				progress,
				topics: topicsWithItems,
				orphanItems,
			};
		},
	});
}

export function useUpdateChecklistMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
			await checklistRepository.update(id, updates);
		},
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: checklistKeys.all });
			queryClient.invalidateQueries({ queryKey: [...checklistKeys.all, "details", id] });
		},
	});
}

export function useManageTopicMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ action, topic }: { action: "CREATE" | "UPDATE" | "DELETE"; topic: any }) => {
			if (action === "CREATE") await checklistTopicRepository.insert(topic);
			if (action === "UPDATE") await checklistTopicRepository.update(topic.id, topic.title);
			if (action === "DELETE") await checklistTopicRepository.remove(topic.id);
		},
		onSuccess: (_, { topic }) => {
			queryClient.invalidateQueries({
				queryKey: [...checklistKeys.all, "details", topic.checklistId],
			});
		},
	});
}

export function useManageItemMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			action,
			item,
		}: {
			action: "CREATE" | "UPDATE" | "DELETE" | "TOGGLE";
			item: any;
		}) => {
			if (action === "CREATE") await checklistItemRepository.insert(item);
			if (action === "UPDATE") await checklistItemRepository.update(item.id, item);
			if (action === "DELETE") await checklistItemRepository.remove(item.id);
			if (action === "TOGGLE") await checklistItemRepository.toggleDone(item.id, item.isDone);
		},
		onSuccess: (_, { item }) => {
			queryClient.invalidateQueries({ queryKey: checklistKeys.all });
			queryClient.invalidateQueries({ queryKey: [...checklistKeys.all, "details", item.checklistId] });
		},
	});
}
