import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import Animated, {
	Extrapolation,
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Local imports
import { HomeEmptyState } from "@/components/home/HomeEmptyState";
import { ChecklistCard } from "@/components/home/ChecklistCard";
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

	/* ---------------- Header animations ---------------- */

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [0, 60], [0, 1], Extrapolation.CLAMP);

		return {
			opacity,
			backgroundColor: `rgba(255, 255, 255, ${opacity * 0.4})`,
		};
	});

	const buttonAnimatedStyle = useAnimatedStyle(() => {
		const width = interpolate(scrollY.value, [0, 80], [160, 48], Extrapolation.CLAMP);

		return { width, height: 48 };
	});

	const buttonTextStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [0, 40], [1, 0], Extrapolation.CLAMP);

		return {
			opacity,
			display: scrollY.value > 50 ? "none" : "flex",
		};
	});

	return (
		<View className="flex-1 bg-linear-to-b from-purple-50 via-pink-50 to-white">
			{/* HEADER */}
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 30,
					paddingTop: insets.top,
				}}
			>
				<Animated.View style={[StyleSheet.absoluteFill, headerAnimatedStyle]}>
					<BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
					<View className="absolute bottom-0 left-0 right-0 h-px bg-gray-200/50" />
				</Animated.View>

				<View className="px-6 py-4 flex-row justify-between items-center">
					<Image source={require("@/assets/logo.png")} className="w-32 h-10" resizeMode="contain" />

					<AnimatedPressable
						onPress={openCreateSheet}
						style={buttonAnimatedStyle}
						className="rounded-2xl flex-row bg-linear-to-r from-indigo-900 to-pink-600 items-center justify-center overflow-hidden"
					>
						<View className="flex-row items-center justify-center px-4 gap-2">
							<Plus size={20} color="white" />
							<Animated.Text numberOfLines={1} style={buttonTextStyle} className="text-white font-bold">
								{t("screens.home.header.new_checklist")}
							</Animated.Text>
						</View>
					</AnimatedPressable>
				</View>
			</View>

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
