import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, Platform, Switch, Keyboard } from "react-native";
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetTextInput,
	BottomSheetScrollView,
	BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import { X, Check, Bell, Trash2, Calendar, Clock } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Portal } from "@gorhom/portal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ConfirmationModal } from "../common/ConfirmationModal";

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
	const [title, setTitle] = useState("");
	const [hasReminder, setHasReminder] = useState(false);
	const [date, setDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showTimePicker, setShowTimePicker] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const snapPoints = useMemo(() => (hasReminder ? ["85%"] : ["60%", "90%"]), [hasReminder]);

	useEffect(() => {
		if (isOpen) {
			bottomSheetRef.current?.snapToIndex(0);
			setTitle(initialData?.title || "");
			setHasReminder(!!initialData?.dueAt);
			setDate(initialData?.dueAt ? new Date(initialData.dueAt) : new Date());
		} else {
			bottomSheetRef.current?.close();
			setShowDeleteConfirm(false);
		}
	}, [isOpen, initialData]);

	useEffect(() => {
		const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
			if (isOpen) {
				bottomSheetRef.current?.snapToIndex(0);
			}
		});

		return () => {
			hideSubscription.remove();
		};
	}, [isOpen]);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
		),
		[],
	);

	const onDateChange = (event: any, selectedDate?: Date) => {
		if (Platform.OS === "android") {
			setShowDatePicker(false);
		}
		if (event.type === "dismissed") {
			setShowDatePicker(false);
			return;
		}
		if (selectedDate) {
			const newDate = new Date(selectedDate);
			newDate.setHours(date.getHours());
			newDate.setMinutes(date.getMinutes());
			setDate(newDate);
		}
	};

	const onTimeChange = (event: any, selectedTime?: Date) => {
		if (Platform.OS === "android") {
			setShowTimePicker(false);
		}
		if (event.type === "dismissed") {
			setShowTimePicker(false);
			return;
		}
		if (selectedTime) {
			const newDate = new Date(date);
			newDate.setHours(selectedTime.getHours());
			newDate.setMinutes(selectedTime.getMinutes());
			setDate(newDate);
		}
	};

	const handleSave = useCallback(() => {
		if (!title.trim()) return;
		onSave({
			title,
			dueAt: hasReminder ? date.getTime() : null,
		});
		onClose();
	}, [title, hasReminder, date, onSave, onClose]);

	const handleDelete = () => {
		if (onDelete) {
			onDelete();
			onClose();
		}
	};

	const renderFooter = useCallback(
		(footerProps: any) => (
			<BottomSheetFooter {...footerProps} bottomInset={0}>
				<View className="px-6 pb-10 bg-white flex-row gap-3">
					{initialData && onDelete && (
						<Pressable
							onPress={() => setShowDeleteConfirm(true)}
							className="rounded-3xl bg-red-50 border border-red-100 items-center justify-center p-4 h-16 w-16"
						>
							<Trash2 size={24} color="#EF4444" />
						</Pressable>
					)}
					<Pressable
						disabled={!title.trim()}
						onPress={handleSave}
						className={`flex-1 flex-row items-center justify-center h-16 rounded-3xl shadow-sm ${
							title.trim() ? "bg-purple-600 active:bg-purple-700" : "bg-gray-200"
						}`}
					>
						<Text className="text-white font-bold text-lg mr-2">{t("common.confirm")}</Text>
						<Check size={20} color="#fff" />
					</Pressable>
				</View>
			</BottomSheetFooter>
		),
		[title, initialData, onDelete, handleSave, t],
	);

	const formattedDate = date.toLocaleDateString();
	const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
				footerComponent={renderFooter}
				keyboardBehavior="extend"
				keyboardBlurBehavior="restore"
				android_keyboardInputMode="adjustResize"
			>
				<BottomSheetScrollView
					key={isOpen ? "open" : "closed"}
					className="flex-1 px-6"
					contentContainerStyle={{ paddingBottom: 120 }}
					keyboardShouldPersistTaps="handled"
				>
					{/* Header */}
					<View className="flex-row items-center justify-between py-4 border-b border-gray-100">
						<Text className="text-xl font-bold text-gray-900">
							{initialData ? t("screens.details.manage_item") : t("screens.details.add_item")}
						</Text>
						<Pressable onPress={onClose} className="p-2 rounded-full active:bg-gray-100">
							<X size={20} color="#9CA3AF" />
						</Pressable>
					</View>

					<View className="py-6 gap-6">
						<View>
							<Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
								{t("screens.home.create_sheet.scratch.name_placeholder")}
							</Text>
							<BottomSheetTextInput
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
								<View>
									<Text className="text-base font-bold text-gray-700">
										{t("common.reminder", { defaultValue: "Lembrete" })}
									</Text>
									{hasReminder && (
										<Text className="text-xs text-purple-600 font-medium">
											{formattedDate} {t("common.at")} {formattedTime}
										</Text>
									)}
								</View>
							</View>
							<Switch
								value={hasReminder}
								onValueChange={(val) => {
									setHasReminder(val);
									if (!val) {
										setShowDatePicker(false);
										setShowTimePicker(false);
									}
								}}
								trackColor={{ false: "#E5E7EB", true: "#C084FC" }}
								thumbColor={hasReminder ? "#9333ea" : "#F3F4F6"}
							/>
						</View>

						{/* Date & Time Selectors */}
						{hasReminder && (
							<View className="flex-row gap-4">
								<Pressable
									onPress={() => {
										setShowDatePicker(!showDatePicker);
										setShowTimePicker(false);
									}}
									className={`flex-1 flex-row items-center justify-between p-5 rounded-3xl border ${
										showDatePicker ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-100"
									} active:bg-gray-100`}
								>
									<View className="flex-row items-center gap-3">
										<Calendar size={18} color={showDatePicker ? "#9333ea" : "#6B7280"} />
										<Text className={`font-semibold ${showDatePicker ? "text-purple-700" : "text-gray-700"}`}>
											{formattedDate}
										</Text>
									</View>
								</Pressable>

								<Pressable
									onPress={() => {
										setShowTimePicker(!showTimePicker);
										setShowDatePicker(false);
									}}
									className={`flex-1 flex-row items-center justify-between p-5 rounded-3xl border ${
										showTimePicker ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-100"
									} active:bg-gray-100`}
								>
									<View className="flex-row items-center gap-3">
										<Clock size={18} color={showTimePicker ? "#9333ea" : "#6B7280"} />
										<Text className={`font-semibold ${showTimePicker ? "text-purple-700" : "text-gray-700"}`}>
											{formattedTime}
										</Text>
									</View>
								</Pressable>
							</View>
						)}

						{/* iOS OK Button for Pickers */}
						{Platform.OS === "ios" && (showDatePicker || showTimePicker) && (
							<View className="flex-row justify-end mb-[-15]">
								<Pressable
									onPress={() => {
										setShowDatePicker(false);
										setShowTimePicker(false);
									}}
									className="px-4 py-2"
								>
									<Text className="text-purple-600 font-bold text-base">{t("common.confirm")}</Text>
								</Pressable>
							</View>
						)}

						{showDatePicker && (
							<DateTimePicker
								value={date}
								mode="date"
								display={Platform.OS === "ios" ? "spinner" : "default"}
								onChange={onDateChange}
								minimumDate={new Date()}
							/>
						)}

						{showTimePicker && (
							<DateTimePicker
								value={date}
								mode="time"
								display={Platform.OS === "ios" ? "spinner" : "default"}
								onChange={onTimeChange}
							/>
						)}
					</View>
				</BottomSheetScrollView>
			</BottomSheet>

			<ConfirmationModal
				visible={showDeleteConfirm}
				message={t("common.delete_confirm")}
				onConfirm={handleDelete}
				onCancel={() => setShowDeleteConfirm(false)}
			/>
		</Portal>
	);
}
