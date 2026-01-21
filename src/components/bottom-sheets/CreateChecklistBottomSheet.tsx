import React, { useMemo, useRef, useEffect, useCallback, useState } from "react";
import {
	View,
	Text,
	Pressable,
	ScrollView,
	TextInput,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
} from "react-native";
import BottomSheet, {
	BottomSheetView,
	BottomSheetBackdrop,
	BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Plus, X, ArrowLeft, Check } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { checklistIconMap } from "@/utils/helpers/checklistIcons";
import { CHECKLIST_TEMPLATES } from "@/constants/checklistTemplates";
import { Portal } from "@gorhom/portal";
import { MotiView, AnimatePresence } from "moti";

interface Props {
	isOpen: boolean;
	onClose: () => void;
	onCreateEmpty: (title: string, description?: string) => void;
	onSelectTemplate: (templateId: string) => void;
}

type Step = "SELECT" | "FORM";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function CreateChecklistBottomSheet({ isOpen, onClose, onCreateEmpty, onSelectTemplate }: Props) {
	const { t } = useTranslation();
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ["85%"], []);

	const [step, setStep] = useState<Step>("SELECT");
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		if (isOpen) {
			bottomSheetRef.current?.expand();
			setStep("SELECT");
			setTitle("");
			setDescription("");
		} else {
			bottomSheetRef.current?.close();
		}
	}, [isOpen]);

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
		),
		[],
	);

	const handleCreateSubmit = () => {
		if (!title.trim()) return;
		onCreateEmpty(title, description);
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
				keyboardBlurBehavior="restore"
			>
				<BottomSheetView className="flex-1 px-6">
					<AnimatePresence exitBeforeEnter>
						{step === "SELECT" ? (
							<MotiView
								key="select"
								from={{ opacity: 0, translateX: -20 }}
								animate={{ opacity: 1, translateX: 0 }}
								exit={{ opacity: 0, translateX: -20 }}
								className="flex-1"
							>
								{/* Header SELECT */}
								<View className="flex-row items-center justify-between py-4 border-b border-gray-100">
									<Text className="text-xl font-bold text-gray-900">
										{t("screens.home.create_sheet.title")}
									</Text>
									<Pressable onPress={onClose} className="p-2 rounded-full active:bg-gray-100">
										<X size={20} color="#9CA3AF" />
									</Pressable>
								</View>

								<ScrollView showsVerticalScrollIndicator={false} className="flex-1">
									{/* Create Empty Trigger */}
									<Pressable
										onPress={() => setStep("FORM")}
										className="mt-6 mb-8 p-5 rounded-3xl border-2 border-purple-100 bg-purple-50/50 active:bg-purple-100"
									>
										<View className="flex-row items-center gap-4">
											<View className="p-3 rounded-2xl bg-purple-600 shadow-sm">
												<Plus size={24} color="#fff" />
											</View>
											<View className="flex-1">
												<Text className="text-base font-bold text-gray-900">
													{t("screens.home.create_sheet.scratch.title")}
												</Text>
												<Text className="text-sm text-gray-500 leading-4 mt-1">
													{t("screens.home.create_sheet.scratch.subtitle")}
												</Text>
											</View>
										</View>
									</Pressable>

									<Text className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
										{t("screens.home.create_sheet.or_template")}
									</Text>

									{/* Templates List */}
									<View className="gap-3 pb-10">
										{Object.keys(CHECKLIST_TEMPLATES).map((key) => {
											const template = CHECKLIST_TEMPLATES[key as keyof typeof CHECKLIST_TEMPLATES];
											const Icon = checklistIconMap[template.icon];
											const totalItems = template.topics.reduce((acc, topic) => acc + topic.items.length, 0);

											return (
												<Pressable
													key={key}
													onPress={() => {
														onSelectTemplate(key);
														onClose();
													}}
													className="p-4 rounded-3xl border border-gray-200 bg-white active:bg-gray-50 active:border-purple-200"
												>
													<View className="flex-row items-center gap-4">
														<View className="p-3 rounded-2xl" style={{ backgroundColor: template.gradient }}>
															<Icon size={22} color="#fff" />
														</View>
														<View className="flex-1">
															<Text className="text-base font-bold text-gray-900">
																{t(`screens.home.templates.${key.toLowerCase()}.title`)}
															</Text>
															<Text className="text-xs text-gray-500 mt-0.5" numberOfLines={1}>
																{t(`screens.home.templates.${key.toLowerCase()}.desc`)}
															</Text>
														</View>
														<View className="bg-gray-50 px-3 py-1 rounded-full">
															<Text className="text-[10px] font-bold text-gray-400">
																{t("screens.home.create_sheet.items_count", { count: totalItems })}
															</Text>
														</View>
													</View>
												</Pressable>
											);
										})}
									</View>
								</ScrollView>
							</MotiView>
						) : (
							<MotiView
								key="form"
								from={{ opacity: 0, translateX: 20 }}
								animate={{ opacity: 1, translateX: 0 }}
								exit={{ opacity: 0, translateX: 20 }}
								className="flex-1"
							>
								{/* Header FORM */}
								<View className="flex-row items-center justify-between py-4 border-b border-gray-100">
									<View className="flex-row items-center gap-3">
										<Pressable
											onPress={() => setStep("SELECT")}
											className="p-2 rounded-full active:bg-gray-100"
										>
											<ArrowLeft size={20} color="#374151" />
										</Pressable>
										<Text className="text-xl font-bold text-gray-900">
											{t("screens.home.create_sheet.scratch.title")}
										</Text>
									</View>
									<Pressable onPress={onClose} className="p-2 rounded-full active:bg-gray-100">
										<X size={20} color="#9CA3AF" />
									</Pressable>
								</View>

								<View className="flex-1 py-6 gap-6">
									{/* Title Input */}
									<View>
										<Text className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
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

									{/* Description Input */}
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

									{/* Submit Button */}
									<View className="mt-auto pb-10">
										<Pressable
											disabled={!title.trim()}
											onPress={handleCreateSubmit}
											className={`flex-row items-center justify-center p-5 rounded-3xl shadow-sm ${
												title.trim() ? "bg-purple-600 active:bg-purple-700" : "bg-gray-200"
											}`}
										>
											<Text className="text-white font-bold text-lg mr-2">
												{t("screens.home.create_sheet.scratch.create_button")}
											</Text>
											<Check size={20} color="#fff" />
										</Pressable>
									</View>
								</View>
							</MotiView>
						)}
					</AnimatePresence>
				</BottomSheetView>
			</BottomSheet>
		</Portal>
	);
}
