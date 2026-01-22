import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import Animated, { useAnimatedScrollHandler, useSharedValue } from "react-native-reanimated";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Local imports
import { HomeEmptyState } from "@/components/home/HomeEmptyState";
import { ChecklistCard } from "@/components/home/ChecklistCard";
import { HomeHeader } from "@/components/home/HomeHeader";
import { CreateChecklistBottomSheet } from "@/components/bottom-sheets/CreateChecklistBottomSheet";

// Data & Logic imports
import { useChecklists, checklistKeys } from "@/queries/checklist.queries";
import { checklistRepository } from "@/repositories/checklist.repository";
import { checklistTopicRepository } from "@/repositories/checklistTopic.repository";
import { checklistItemRepository } from "@/repositories/checklistItem.repository";
import { CHECKLIST_TEMPLATES } from "@/constants/checklistTemplates";
import { generateUUID } from "@/utils/helpers/uuid";
import { calculateProgress } from "@/utils/helpers/calculateProgress";
import { SkeletonChecklist } from "@/components/home/SkeletonChecklist";

export default function Home() {
	const { t } = useTranslation();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const queryClient = useQueryClient();
	const scrollY = useSharedValue(0);

	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const { data: checklists = [], isPending } = useChecklists();

	const openCreateSheet = () => setIsCreateOpen(true);
	const closeCreateSheet = () => setIsCreateOpen(false);

	const scrollHandler = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	/* ---------------- Database Actions ---------------- */

	const handleCreateEmpty = async (title: string, description?: string) => {
		const id = generateUUID();
		await checklistRepository.insert({
			id,
			title,
			description,
			type: "EMPTY",
			status: "ACTIVE",
			createdAt: Date.now(),
		});

		queryClient.invalidateQueries({ queryKey: checklistKeys.all });
		closeCreateSheet();
	};

	const handleSelectTemplate = async (templateId: string) => {
		const templateKey = templateId as keyof typeof CHECKLIST_TEMPLATES;
		const template = CHECKLIST_TEMPLATES[templateKey];
		const checklistId = generateUUID();

		// 1. Inserir a Checklist principal
		await checklistRepository.insert({
			id: checklistId,
			title: t(template.titleKey),
			description: t(template.descriptionKey),
			type: templateId as any,
			status: "ACTIVE",
			createdAt: Date.now(),
		});

		// 2. Inserir Tópicos e Itens (Semente do Template)
		for (const [tIdx, topicData] of template.topics.entries()) {
			const topicId = generateUUID();

			await checklistTopicRepository.insert({
				id: topicId,
				checklistId,
				title: t(topicData.titleKey),
				order: tIdx,
				createdAt: Date.now(),
			});

			for (const itemData of topicData.items) {
				await checklistItemRepository.insert({
					id: generateUUID(),
					checklistId,
					topicId,
					title: t(itemData.titleKey),
					isDone: false,
					createdAt: Date.now(),
				});
			}
		}

		// Atualiza a lista na Home
		queryClient.invalidateQueries({ queryKey: checklistKeys.all });
		closeCreateSheet();
	};

	return (
		<View className="flex-1 bg-linear-to-b from-purple-50 via-pink-50 to-white">
			<HomeHeader scrollY={scrollY} onNewChecklistPress={openCreateSheet} />

			{/* CONTENT */}
			<Animated.ScrollView
				onScroll={scrollHandler}
				scrollEventThrottle={16}
				className="flex-1"
				contentContainerStyle={{
					paddingTop: insets.top + 100,
					paddingBottom: 120,
				}}
				showsVerticalScrollIndicator={false}
			>
				<View className="px-6">
					<Text className="text-lg font-semibold text-gray-800 mb-4">{t("screens.home.welcome")}</Text>

					{/* Loading State */}
					{isPending && (
						<>
							{Array.from({ length: 2 }).map((_, i) => (
								<SkeletonChecklist key={i} />
							))}
						</>
					)}

					{/* Empty state */}
					{!isPending && checklists.length === 0 && <HomeEmptyState onCreatePress={openCreateSheet} />}

					{/* List of Checklists */}
					{!isPending &&
						checklists.map((checklist: any) => (
							<ChecklistCard
								key={checklist.id}
								checklist={{
									...checklist,
									progress: calculateProgress(checklist.completedItems, checklist.totalItems),
								}}
								onPress={() => {
									router.push(`/checklist/${checklist.id}`);
								}}
							/>
						))}
				</View>
			</Animated.ScrollView>

			{/* Bottom Sheet */}
			<CreateChecklistBottomSheet
				isOpen={isCreateOpen}
				onClose={closeCreateSheet}
				onCreateEmpty={handleCreateEmpty}
				onSelectTemplate={handleSelectTemplate}
			/>
		</View>
	);
}
