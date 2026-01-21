import React, { useState, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { ChevronDown, ChevronUp, Plus, Edit2, MoreHorizontal, Trash2 } from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";
import { useTranslation } from "react-i18next";
import { ItemRow } from "./ItemRow";
import { DropdownMenu } from "../common/DropdownMenu";
import { ConfirmationModal } from "../common/ConfirmationModal";

interface Props {
	title: string;
	items: any[];
	onToggleItem: (itemId: string, isDone: boolean) => void;
	onAddItem: () => void;
	onEditItem: (item: any) => void;
	onEditTopic: () => void;
	onDeleteTopic: () => void;
}

export function TopicAccordion({
	title,
	items,
	onToggleItem,
	onAddItem,
	onEditItem,
	onEditTopic,
	onDeleteTopic,
}: Props) {
	const { t } = useTranslation();
	const [expanded, setExpanded] = useState(true);
	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const moreButtonRef = useRef<View>(null);

	const completedCount = items.filter((i) => i.isDone).length;
	const totalCount = items.length;
	const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

	const handleOpenMenu = () => {
		moreButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
			setMenuPosition({ x: pageX, y: pageY });
			setMenuVisible(true);
		});
	};

	return (
		<View className="mb-4 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
			{/* Header */}
			<View className="flex-row items-center">
				<Pressable
					onPress={() => setExpanded(!expanded)}
					className="flex-1 p-5 flex-row items-center justify-between"
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

				{/* Menu Actions Trigger */}
				<View ref={moreButtonRef} collapsable={false}>
					<Pressable onPress={handleOpenMenu} className="pr-5 py-5 pl-2 active:opacity-60">
						<View className="p-2 bg-gray-50 rounded-xl">
							<MoreHorizontal size={18} color="#6B7280" />
						</View>
					</Pressable>
				</View>
			</View>

			{/* Content */}
			<AnimatePresence>
				{expanded && (
					<MotiView
						from={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{
							type: "timing",
							duration: 300,
						}}
						style={{ overflow: "hidden" }}
					>
						<View className="px-5 pb-5">
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
						</View>
					</MotiView>
				)}
			</AnimatePresence>

			<DropdownMenu
				visible={menuVisible}
				onClose={() => setMenuVisible(false)}
				anchorPosition={menuPosition}
				items={[
					{
						label: t("common.edit"),
						icon: Edit2,
						onPress: onEditTopic,
					},
					{
						label: t("common.delete"),
						icon: Trash2,
						variant: "danger",
						onPress: () => setShowDeleteConfirm(true),
					},
				]}
			/>

			<ConfirmationModal
				visible={showDeleteConfirm}
				title={t("common.are_you_sure")}
				message={t("common.delete_confirm")}
				onConfirm={() => {
					onDeleteTopic();
					setShowDeleteConfirm(false);
				}}
				onCancel={() => setShowDeleteConfirm(false)}
			/>
		</View>
	);
}
