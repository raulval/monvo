import React, { useMemo, useState } from "react";
import { View, Text, ScrollView, RefreshControl, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { format, isToday, isTomorrow, startOfDay, addDays } from "date-fns";
import { Bell } from "lucide-react-native";
import Animated, { useSharedValue, useAnimatedScrollHandler } from "react-native-reanimated";

import { useManageItemMutation } from "@/queries/checklist.queries";
import { useUpcomingReminders } from "@/queries/checklistItem.queries";
import { ReminderCard } from "@/components/reminders/ReminderCard";
import { RemindersEmptyState } from "@/components/reminders/RemindersEmptyState";
import { RemindersHeader } from "@/components/reminders/RemindersHeader";
import { ManageItemBottomSheet } from "@/components/bottom-sheets/ManageItemBottomSheet";

export default function RemindersScreen() {
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { data: reminders = [], isLoading, refetch } = useUpcomingReminders();
	const manageItem = useManageItemMutation();

	const [selectedItem, setSelectedItem] = useState<any>(null);
	const [isEditOpen, setIsEditOpen] = useState(false);

	const scrollY = useSharedValue(0);

	const onScroll = useAnimatedScrollHandler((event) => {
		scrollY.value = event.contentOffset.y;
	});

	const groupedReminders = useMemo(() => {
		const groups = {
			expired: [] as any[],
			today: [] as any[],
			tomorrow: [] as any[],
			later: [] as any[],
		};

		const now = Date.now();
		const todayStart = startOfDay(new Date());

		reminders.forEach((item: any) => {
			const date = new Date(item.dueAt);

			if (item.dueAt < now && !isToday(date)) {
				groups.expired.push(item);
			} else if (isToday(date)) {
				groups.today.push(item);
			} else if (isTomorrow(date)) {
				groups.tomorrow.push(item);
			} else {
				groups.later.push(item);
			}
		});

		return groups;
	}, [reminders]);

	const handleToggleDone = (item: any) => {
		manageItem.mutate({
			action: "TOGGLE",
			item: { id: item.id, isDone: !item.isDone, checklistId: item.checklistId },
		});
	};

	const handleEditTime = (item: any) => {
		setSelectedItem(item);
		setIsEditOpen(true);
	};

	const renderSectionHeader = (title: string, type: "overdue" | "today" | "tomorrow" | "later") => {
		const colors = {
			overdue: { bg: "bg-gray-300" },
			today: { bg: "bg-red-500" },
			tomorrow: { bg: "bg-amber-500" },
			later: { bg: "bg-blue-500" },
		};

		const { bg } = colors[type];

		return (
			<View className="flex-row items-center gap-3 px-6 mt-8 mb-4">
				<View className={`w-2.5 h-2.5 rounded-full ${bg}`} />
				<Text className={`text-xl font-bold text-gray-700`}>{title}</Text>
			</View>
		);
	};

	if (isLoading) {
		return <View className="flex-1 bg-purple-50/10" />;
	}

	return (
		<View className="flex-1 bg-linear-to-b from-purple-50 via-pink-50 to-white">
			<RemindersHeader scrollY={scrollY} />

			<Animated.ScrollView
				className="flex-1"
				onScroll={onScroll}
				scrollEventThrottle={16}
				contentContainerStyle={{
					paddingTop: 120 + insets.top,
					paddingBottom: 120,
				}}
				showsVerticalScrollIndicator={false}
				refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
			>
				{reminders.length === 0 ? (
					<RemindersEmptyState
						onAddReminder={() => router.push("/")}
						completionRate={0} // Ideally fetch this from a summary query
					/>
				) : (
					<View className="px-1">
						{groupedReminders.expired.length > 0 && (
							<>
								{renderSectionHeader(t("screens.reminders.sections.overdue"), "overdue")}
								<View className="px-5">
									{groupedReminders.expired.map((item) => (
										<ReminderCard
											key={item.id}
											{...item}
											onToggle={() => handleToggleDone(item)}
											onPress={() => router.push(`/checklist/${item.checklistId}`)}
											onEditTime={() => handleEditTime(item)}
										/>
									))}
								</View>
							</>
						)}

						{groupedReminders.today.length > 0 && (
							<>
								{renderSectionHeader(t("screens.reminders.sections.today"), "today")}
								<View className="px-5">
									{groupedReminders.today.map((item) => (
										<ReminderCard
											key={item.id}
											{...item}
											onToggle={() => handleToggleDone(item)}
											onPress={() => router.push(`/checklist/${item.checklistId}`)}
											onEditTime={() => handleEditTime(item)}
										/>
									))}
								</View>
							</>
						)}

						{groupedReminders.tomorrow.length > 0 && (
							<>
								{renderSectionHeader(t("screens.reminders.sections.tomorrow"), "tomorrow")}
								<View className="px-5">
									{groupedReminders.tomorrow.map((item) => (
										<ReminderCard
											key={item.id}
											{...item}
											onToggle={() => handleToggleDone(item)}
											onPress={() => router.push(`/checklist/${item.checklistId}`)}
											onEditTime={() => handleEditTime(item)}
										/>
									))}
								</View>
							</>
						)}

						{groupedReminders.later.length > 0 && (
							<>
								{renderSectionHeader(t("screens.reminders.sections.later"), "later")}
								<View className="px-5">
									{groupedReminders.later.map((item) => (
										<ReminderCard
											key={item.id}
											{...item}
											onToggle={() => handleToggleDone(item)}
											onPress={() => router.push(`/checklist/${item.checklistId}`)}
											onEditTime={() => handleEditTime(item)}
										/>
									))}
								</View>
							</>
						)}
					</View>
				)}
			</Animated.ScrollView>

			<ManageItemBottomSheet
				isOpen={isEditOpen}
				onClose={() => {
					setIsEditOpen(false);
					setSelectedItem(null);
				}}
				initialData={selectedItem}
				onSave={(data) => {
					const { checklistTitle, ...cleanItem } = selectedItem;
					manageItem.mutate({
						action: "UPDATE",
						item: { ...cleanItem, ...data },
					});
				}}
				onDelete={() => manageItem.mutate({ action: "DELETE", item: selectedItem })}
			/>
		</View>
	);
}
