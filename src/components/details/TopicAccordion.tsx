import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronDown, ChevronUp, Plus } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { useTranslation } from "react-i18next";
import { ItemRow } from "./ItemRow";

interface Props {
	title: string;
	items: any[];
	onToggleItem: (itemId: string, isDone: boolean) => void;
	onAddItem: () => void;
	onEditItem: (item: any) => void;
	onEditTopic: () => void;
}

export function TopicAccordion({ title, items, onToggleItem, onAddItem, onEditItem, onEditTopic }: Props) {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(true);

	const completedCount = items.filter((i) => i.isDone).length;
	const totalCount = items.length;
	const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	return (
		<View className="mb-4 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
			{/* Header */}
			<Pressable
				onPress={() => setExpanded(!expanded)}
				onLongPress={onEditTopic}
				className="p-5 flex-row items-center justify-between"
			>
				<View className="flex-1">
					<Text className="text-xl font-bold text-gray-900 mb-3">{title}</Text>
					<View className="flex-row items-center gap-4">
						<View className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
							<MotiView animate={{ width: `${progress}%` }} className="h-full bg-pink-500 rounded-full" />
						</View>
						<Text className="text-xs font-bold text-gray-500 w-8">
							{completedCount}/{totalCount}
						</Text>
					</View>
				</View>
				<View className="ml-4">
					{expanded ? <ChevronUp size={20} color="#9CA3AF" /> : <ChevronDown size={20} color="#9CA3AF" />}
				</View>
			</Pressable>

			{/* Content */}
			<AnimatePresence>
				{expanded && (
					<MotiView
						from={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						className="px-5 pb-5"
					>
						<View className="gap-1">
							{items.map((item) => (
								<ItemRow
									key={item.id}
									title={item.title}
									isDone={item.isDone === 1 || item.isDone === true}
									hasReminder={!!item.dueAt}
									onToggle={() => onToggleItem(item.id, !item.isDone)}
									onPress={() => onEditItem(item)}
								/>
							))}
						</View>

						{/* Add Item Trigger */}
						<Pressable
							onPress={onAddItem}
							className="mt-4 py-4 rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center active:bg-gray-50 flex-row gap-2"
						>
							<Plus size={18} color="#9CA3AF" />
							<Text className="text-sm font-bold text-gray-400">{t("screens.details.add_item")}</Text>
						</Pressable>
					</MotiView>
				)}
			</AnimatePresence>
		</View>
	);
}
