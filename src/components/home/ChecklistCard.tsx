import { View, Text, Pressable } from "react-native";
import { Archive, MoreHorizontal, Trash2 } from "lucide-react-native";
import { checklistIconMap } from "@/utils/helpers/checklistIcons";
import { CHECKLIST_TEMPLATES } from "@/constants/checklistTemplates";
import { ChecklistEntity } from "@/types/checklist-entity";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { DropdownMenu } from "../common/DropdownMenu";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { checklistRepository } from "@/repositories/checklist.repository";
import { useQueryClient } from "@tanstack/react-query";
import { checklistKeys } from "@/queries/checklist.queries";

interface ChecklistCardProps {
	checklist: ChecklistEntity & {
		totalItems: number;
		completedItems: number;
		progress: number;
	};
	onPress: () => void;
}

export function ChecklistCard({ checklist, onPress }: ChecklistCardProps) {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const moreButtonRef = useRef<View>(null);

	const [menuVisible, setMenuVisible] = useState(false);
	const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

	const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const handleOpenMenu = () => {
		moreButtonRef.current?.measure((x, y, width, height, pageX, pageY) => {
			setMenuPosition({ x: pageX, y: pageY });
			setMenuVisible(true);
		});
	};

	const handleArchive = async () => {
		await checklistRepository.archive(checklist.id);
		queryClient.invalidateQueries({ queryKey: checklistKeys.all });
		setShowArchiveConfirm(false);
	};

	const handleDelete = async () => {
		await checklistRepository.remove(checklist.id);
		queryClient.invalidateQueries({ queryKey: checklistKeys.all });
		setShowDeleteConfirm(false);
	};

	const isCustom = checklist.type === "EMPTY";
	const visualBase = isCustom
		? { icon: "default", gradient: ["#312c85", "#e60076"] }
		: {
				icon: CHECKLIST_TEMPLATES[checklist.type].icon,
				gradient: [
					CHECKLIST_TEMPLATES[checklist.type].gradient,
					CHECKLIST_TEMPLATES[checklist.type].gradient,
				],
			};

	const Icon = checklistIconMap[visualBase.icon as keyof typeof checklistIconMap] || checklistIconMap.default;

	return (
		<>
			<Pressable
				onPress={onPress}
				className="mb-4 active:scale-[0.98] transition-all p-6 rounded-4xl overflow-hidden shadow-sm bg-linear-to-r from-indigo-900 to-pink-600"
			>
				{/* Header */}
				<View className="flex-row items-start justify-between mb-5">
					<View className="p-3 bg-white/20 rounded-2xl border border-white/30">
						<Icon size={24} color="white" />
					</View>
					<Pressable
						ref={moreButtonRef}
						onPress={handleOpenMenu}
						className="bg-white/20 p-2 rounded-full active:bg-white/30"
					>
						<MoreHorizontal size={18} color="white" />
					</Pressable>
				</View>

				{/* Info */}
				<View>
					<Text className="text-2xl font-bold text-white mb-1" numberOfLines={1}>
						{checklist.title}
					</Text>

					{checklist.description && (
						<Text className="text-sm text-white/70 font-medium uppercase tracking-wider">
							{checklist.description}
						</Text>
					)}
				</View>

				{/* Progress Section */}
				<View className="mt-6">
					<View className="flex-row justify-between items-end mb-2">
						<Text className="text-white/80 text-xs font-bold">
							{checklist.completedItems} /{" "}
							{t("screens.home.create_sheet.items_count", { count: checklist.totalItems })}
						</Text>
						<Text className="text-white text-lg font-black">{checklist.progress}%</Text>
					</View>

					{/* Bar */}
					<View className="h-2.5 bg-black/10 rounded-full overflow-hidden border border-white/10">
						<View
							className="h-full bg-white rounded-full shadow-sm"
							style={{ width: `${checklist.progress}%` }}
						/>
					</View>
				</View>
			</Pressable>

			{/* Components de UI Extras */}
			<DropdownMenu
				visible={menuVisible}
				onClose={() => setMenuVisible(false)}
				anchorPosition={menuPosition}
				items={[
					{
						label: t("common.archive"),
						icon: Archive,
						onPress: () => setShowArchiveConfirm(true),
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
				visible={showArchiveConfirm}
				message={t("common.archive_confirm")}
				confirmText={t("common.archive")}
				onConfirm={handleArchive}
				onCancel={() => setShowArchiveConfirm(false)}
			/>

			<ConfirmationModal
				visible={showDeleteConfirm}
				message={t("common.delete_confirm")}
				confirmText={t("common.delete")}
				onConfirm={handleDelete}
				onCancel={() => setShowDeleteConfirm(false)}
			/>
		</>
	);
}
