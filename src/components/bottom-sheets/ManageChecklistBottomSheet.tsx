import React, { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, Keyboard } from "react-native";
import BottomSheet, {
	BottomSheetBackdrop,
	BottomSheetTextInput,
	BottomSheetScrollView,
	BottomSheetFooter,
} from "@gorhom/bottom-sheet";
import { X, Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Portal } from "@gorhom/portal";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onSave: (data: { title: string; description?: string }) => void;
	initialData?: { title: string; description?: string };
}

export function ManageChecklistBottomSheet({ isOpen, onClose, onSave, initialData }: Props) {
	const { t } = useTranslation();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ["60%", "90%"], []);

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		if (isOpen) {
			bottomSheetRef.current?.snapToIndex(0);
			setTitle(initialData?.title || "");
			setDescription(initialData?.description || "");
		} else {
			bottomSheetRef.current?.close();
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

	const handleSave = useCallback(() => {
		if (!title.trim()) return;
		onSave({ title, description });
		onClose();
	}, [title, description, onSave, onClose]);

	const renderFooter = useCallback(
		(footerProps: any) => (
			<BottomSheetFooter {...footerProps} bottomInset={0}>
				<View className="px-6 pb-10 bg-white">
					<Pressable
						disabled={!title.trim()}
						onPress={handleSave}
						className={`flex-row items-center justify-center p-5 rounded-3xl shadow-sm ${
							title.trim() ? "bg-purple-600 active:bg-purple-700" : "bg-gray-200"
						}`}
					>
						<Text className="text-white font-bold text-lg mr-2">{t("common.confirm")}</Text>
						<Check size={20} color="#fff" />
					</Pressable>
				</View>
			</BottomSheetFooter>
		),
		[title, handleSave, t],
	);

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
					className="flex-1 px-6"
					contentContainerStyle={{ paddingBottom: 100 }}
					keyboardShouldPersistTaps="handled"
				>
					{/* Header */}
					<View className="flex-row items-center justify-between py-4 border-b border-gray-100">
						<Text className="text-xl font-bold text-gray-900">{t("screens.details.edit_checklist")}</Text>
						<Pressable onPress={onClose} className="p-2 rounded-full active:bg-gray-100">
							<X size={20} color="#9CA3AF" />
						</Pressable>
					</View>

					<View className="py-6 gap-6">
						<View>
							<Text className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
								{t("screens.home.create_sheet.scratch.name_placeholder")}
							</Text>
							<BottomSheetTextInput
								placeholder={t("screens.home.create_sheet.scratch.name_placeholder")}
								value={title}
								onChangeText={setTitle}
								className="bg-gray-50 p-5 rounded-3xl text-lg font-semibold text-gray-900 border border-gray-100"
							/>
						</View>

						<View>
							<Text className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
								{t("screens.home.create_sheet.scratch.description_placeholder")}
							</Text>
							<BottomSheetTextInput
								placeholder={t("screens.home.create_sheet.scratch.description_placeholder")}
								value={description}
								onChangeText={setDescription}
								multiline
								numberOfLines={3}
								textAlignVertical="top"
								className="bg-gray-50 p-5 rounded-3xl text-base text-gray-600 border border-gray-100 h-32"
							/>
						</View>
					</View>
				</BottomSheetScrollView>
			</BottomSheet>
		</Portal>
	);
}
