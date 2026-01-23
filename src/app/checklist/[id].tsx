import React, { useState } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";
import {
	useChecklistDetails,
	useUpdateChecklistMutation,
	useManageTopicMutation,
	useManageItemMutation,
} from "@/queries/checklist.queries";
import { ChecklistHeader } from "@/components/details/ChecklistHeader";
import { TopicAccordion } from "@/components/details/TopicAccordion";
import { ManageChecklistBottomSheet } from "@/components/bottom-sheets/ManageChecklistBottomSheet";
import { ManageTopicBottomSheet } from "@/components/bottom-sheets/ManageTopicBottomSheet";
import { ManageItemBottomSheet } from "@/components/bottom-sheets/ManageItemBottomSheet";
import { generateUUID } from "@/utils/helpers/uuid";

export default function ChecklistDetailsScreen() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const { t } = useTranslation();
	const { data: checklist, isLoading } = useChecklistDetails(id!);

	const scrollY = useSharedValue(0);
	const onScroll = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	const updateChecklist = useUpdateChecklistMutation();
	const manageTopic = useManageTopicMutation();
	const manageItem = useManageItemMutation();

	// Sheet States
	const [editChecklistOpen, setEditChecklistOpen] = useState(false);
	const [manageTopicOpen, setManageTopicOpen] = useState(false);
	const [manageItemOpen, setManageItemOpen] = useState(false);

	// Selection States
	const [selectedTopic, setSelectedTopic] = useState<any>(null);
	const [selectedItem, setSelectedItem] = useState<any>(null);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center bg-gray-50">
				<ActivityIndicator size="large" color="#9333ea" />
			</View>
		);
	}

	if (!checklist) return null;

	return (
		<View className="flex-1 bg-gray-50">
			<ChecklistHeader
				title={checklist.title}
				description={checklist.description}
				progress={checklist.progress}
				completedItems={checklist.completedItems}
				totalItems={checklist.totalItems}
				onEdit={() => setEditChecklistOpen(true)}
				scrollY={scrollY}
			/>

			<Animated.ScrollView
				onScroll={onScroll}
				scrollEventThrottle={16}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingTop: 340, paddingBottom: 120 }}
			>
				<View className="px-6 pt-28">
					{checklist.topics.map((topic: any) => (
						<TopicAccordion
							key={topic.id}
							title={topic.title}
							items={topic.items}
							onToggleItem={(itemId, isDone) =>
								manageItem.mutate({ action: "TOGGLE", item: { id: itemId, isDone, checklistId: id } })
							}
							onAddItem={() => {
								setSelectedTopic(topic);
								setSelectedItem(null);
								setManageItemOpen(true);
							}}
							onEditItem={(item) => {
								setSelectedItem(item);
								setSelectedTopic(topic);
								setManageItemOpen(true);
							}}
							onEditTopic={() => {
								setSelectedTopic(topic);
								setManageTopicOpen(true);
							}}
							onDeleteTopic={() => {
								manageTopic.mutate({ action: "DELETE", topic });
							}}
						/>
					))}
				</View>
			</Animated.ScrollView>

			{/* Floating Button for New Topic */}
			<Pressable
				onPress={() => {
					setSelectedTopic(null);
					setManageTopicOpen(true);
				}}
				className="absolute bottom-10 right-6 w-16 h-16 bg-linear-to-br from-indigo-900 to-pink-600 rounded-full shadow-xl items-center justify-center active:scale-95 transition-all"
			>
				<Plus size={32} color="white" />
			</Pressable>

			{/* Bottom Sheets */}
			<ManageChecklistBottomSheet
				isOpen={editChecklistOpen}
				onClose={() => setEditChecklistOpen(false)}
				initialData={{ title: checklist.title, description: checklist.description }}
				onSave={(data) => updateChecklist.mutate({ id: checklist.id, updates: data })}
			/>

			<ManageTopicBottomSheet
				isOpen={manageTopicOpen}
				onClose={() => {
					setManageTopicOpen(false);
					setSelectedTopic(null);
				}}
				initialTitle={selectedTopic?.title}
				onSave={(title) => {
					if (selectedTopic) {
						manageTopic.mutate({ action: "UPDATE", topic: { ...selectedTopic, title } });
					} else {
						manageTopic.mutate({
							action: "CREATE",
							topic: {
								id: generateUUID(),
								checklistId: id,
								title,
								order: checklist.topics.length,
								createdAt: Date.now(),
							},
						});
					}
				}}
				onDelete={() => manageTopic.mutate({ action: "DELETE", topic: selectedTopic })}
			/>

			<ManageItemBottomSheet
				isOpen={manageItemOpen}
				onClose={() => {
					setManageItemOpen(false);
					setSelectedItem(null);
				}}
				initialData={selectedItem}
				onSave={(data) => {
					if (selectedItem) {
						manageItem.mutate({
							action: "UPDATE",
							item: { ...selectedItem, ...data, checklistId: id },
						});
					} else {
						manageItem.mutate({
							action: "CREATE",
							item: {
								id: generateUUID(),
								checklistId: id,
								topicId: selectedTopic?.id,
								title: data.title,
								isDone: false,
								dueAt: data.dueAt,
								createdAt: Date.now(),
							},
						});
					}
				}}
				onDelete={() => manageItem.mutate({ action: "DELETE", item: selectedItem })}
			/>
		</View>
	);
}
