import React from "react";
import { View, Text, Modal, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { MotiView, AnimatePresence } from "moti";

interface ConfirmationModalProps {
	visible: boolean;
	title?: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ConfirmationModal({
	visible,
	title,
	message,
	confirmText,
	cancelText,
	onConfirm,
	onCancel,
}: ConfirmationModalProps) {
	const { t } = useTranslation();

	return (
		<Modal transparent visible={visible} animationType="none" onRequestClose={onCancel}>
			<AnimatePresence>
				{visible && (
					<View className="flex-1 justify-center items-center px-6">
						{/* Backdrop */}
						<MotiView
							from={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 bg-black/60"
						>
							<Pressable className="flex-1" onPress={onCancel} />
						</MotiView>

						{/* Content */}
						<MotiView
							from={{ opacity: 0, scale: 0.9, translateY: 20 }}
							animate={{ opacity: 1, scale: 1, translateY: 0 }}
							exit={{ opacity: 0, scale: 0.9, translateY: 20 }}
							className="bg-white w-full max-w-sm rounded-2xl p-8 overflow-hidden"
						>
							<Text className="text-2xl font-bold text-slate-900 mb-2">
								{title || t("common.are_you_sure")}
							</Text>
							<Text className="text-slate-500 text-lg leading-6 mb-8">{message}</Text>

							<View className="flex-row gap-3">
								<Pressable
									onPress={onCancel}
									className="flex-1 py-4 bg-slate-100 rounded-2xl active:bg-slate-200 active:scale-[0.98]"
								>
									<Text className="text-center text-slate-600 font-bold text-lg">
										{cancelText || t("common.cancel")}
									</Text>
								</Pressable>

								<Pressable
									onPress={onConfirm}
									className="flex-1 py-4 bg-red-500 rounded-2xl active:bg-red-600 active:scale-[0.98]"
								>
									<Text className="text-center text-white font-bold text-lg">
										{confirmText || t("common.confirm")}
									</Text>
								</Pressable>
							</View>
						</MotiView>
					</View>
				)}
			</AnimatePresence>
		</Modal>
	);
}
