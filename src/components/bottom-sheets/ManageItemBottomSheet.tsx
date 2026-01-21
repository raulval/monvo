import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, ScrollView, Switch } from "react-native";
import BottomSheet, {
	BottomSheetView,
	BottomSheetBackdrop,
	BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { X, Check, Bell, Trash2 } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Portal } from "@gorhom/portal";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: { title: string; dueAt?: number | null }) => void;
	onDelete?: () => void;
	initialData?: { title: string; dueAt?: number | null };
}

export function ManageItemBottomSheet({ isOpen, onClose, onSave, onDelete, initialData }: Props) {
	const { t } = useTranslation();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ["50%"], []);

	const [title, setTitle] = useState("");
	const [hasReminder, setHasReminder] = useState(false);
	const [dueAt, setDueAt] = useState<number | null>(null);

	useEffect(() => {
		if (isOpen) {
			bottomSheetRef.current?.expand();
			setTitle(initialData?.title || "");
			setHasReminder(!!initialData?.dueAt);
			setDueAt(initialData?.dueAt || null);
		} else {
			bottomSheetRef.current?.close();
		}
	}, [isOpen, initialData]);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
		),
		[],
	);

	const handleSave = () => {
		if (!title.trim()) return;
		onSave({
			title,
			dueAt: hasReminder ? dueAt || Date.now() + 86400000 : null, // Default to tomorrow if enabled but no date
		});
		onClose();
	};

	return (
		<Portal>
			<BottomSheet
				ref={bottomSheetRef}
				snapPoints={snapPoints}
				enablePanDownToClose
				onClose={onClose}
				index={-1}
				backgroundStyle={{ borderRadius: 32 }}
				backdropComponent={renderBackdrop}
				keyboardBehavior="extend"
			>
				<BottomSheetView className="flex-1 px-6">
					{/* Header */}
					<View className="flex-row items-center justify-between py-4 border-b border-gray-100">
						<Text className="text-xl font-bold text-gray-900">
							{initialData ? t("screens.details.manage_item") : t("screens.details.add_item")}
						</Text>
						<Pressable onPress={onClose} className="p-2 rounded-full active:bg-gray-100">
							<X size={20} color="#9CA3AF" />
						</Pressable>
					</View>

					<View className="flex-1 py-6 gap-6">
						<View>
							<Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
								{t("screens.home.create_sheet.scratch.name_placeholder")}
							</Text>
							<BottomSheetTextInput
								autoFocus
								placeholder={t("screens.home.create_sheet.scratch.name_placeholder")}
								value={title}
								onChangeText={setTitle}
								className="bg-gray-50 p-5 rounded-3xl text-lg font-semibold text-gray-900 border border-gray-100"
							/>
						</View>

						{/* Reminder Toggle */}
						<View className="flex-row items-center justify-between bg-gray-50 p-5 rounded-3xl border border-gray-100">
							<View className="flex-row items-center gap-3">
								<View className="p-2 bg-purple-100 rounded-xl">
									<Bell size={20} color="#9333ea" />
								</View>
								<Text className="text-base font-bold text-gray-700">
									{t("common.reminder", { defaultValue: "Lembrete" })}
								</Text>
							</View>
							<Switch
								value={hasReminder}
								onValueChange={setHasReminder}
								trackColor={{ false: "#E5E7EB", true: "#C084FC" }}
								thumbColor={hasReminder ? "#9333ea" : "#F3F4F6"}
							/>
						</View>

						{/* Footer Actions */}
						<View className="mt-auto pb-10 flex-row gap-3">
							{initialData && onDelete && (
								<Pressable
									onPress={() => {
										onDelete();
										onClose();
									}}
									className="p-5 rounded-3xl bg-red-50 border border-red-100 items-center justify-center"
								>
									<Trash2 size={24} color="#EF4444" />
								</Pressable>
							)}
							<Pressable
								disabled={!title.trim()}
								onPress={handleSave}
								className={`flex-1 flex-row items-center justify-center p-5 rounded-3xl shadow-sm ${
									title.trim() ? "bg-purple-600 active:bg-purple-700" : "bg-gray-200"
								}`}
							>
								<Text className="text-white font-bold text-lg mr-2">{t("common.confirm")}</Text>
								<Check size={20} color="#fff" />
							</Pressable>
						</View>
					</View>
				</BottomSheetView>
			</BottomSheet>
		</Portal>
	);
}
