import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Plus, Sparkles, Bell } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface RemindersEmptyStateProps {
	onAddReminder: () => void;
	completionRate?: number;
}

export function RemindersEmptyState({ onAddReminder, completionRate = 0 }: RemindersEmptyStateProps) {
	const { t } = useTranslation();

	return (
		<View className="flex-1 px-4 mt-4">
			<Animated.View
				entering={FadeInDown.duration(600).springify()}
				className="bg-white rounded-[40px] p-8 items-center shadow-xl shadow-gray-200/50 border border-gray-100"
			>
				{/* Celebration Icon Container */}
				<View className="relative mb-8">
					<View className="w-32 h-32 bg-green-50 rounded-full items-center justify-center">
						<View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center">
							<CheckCircle2 size={56} color="#22c55e" strokeWidth={2.5} />
						</View>
					</View>
					<View className="absolute top-2 right-2 w-8 h-8 bg-amber-400 rounded-full items-center justify-center border-2 border-white shadow-sm">
						<Sparkles size={16} color="white" fill="white" />
					</View>
				</View>

				<Text className="text-[28px] leading-9 font-bold text-gray-900 text-center mb-3">
					{t("screens.reminders.empty.title")}
				</Text>
				<Text className="text-gray-500 text-center text-lg leading-6 mb-8 px-2">
					{t("screens.reminders.empty.description")}
				</Text>

				{/* Progress Dashboard Card */}
				<View className="bg-purple-50/50 p-6 rounded-3xl w-full mb-10 items-center border border-purple-100/50">
					<View className="flex-row items-center gap-2 mb-2">
						<View className="w-2 h-2 bg-green-500 rounded-full" />
						<Text className="text-sm font-bold text-gray-600 uppercase tracking-tight">
							{t("screens.reminders.stats.title")}
						</Text>
					</View>
					<Text className="text-5xl font-black text-purple-600 mb-1">{completionRate}%</Text>
					<Text className="text-sm text-gray-500 font-medium">{t("screens.reminders.stats.subtitle")}</Text>
				</View>

				{/* Action Buttons */}
				<View className="w-full gap-4">
					<Pressable
						onPress={onAddReminder}
						className="bg-linear-to-r from-indigo-900 to-pink-600 h-16 rounded-2xl items-center justify-center flex-row gap-3 shadow-lg shadow-purple-200 active:scale-95 transition-all"
					>
						<Bell size={24} color="white" strokeWidth={2.5} />
						<Text className="text-white font-bold text-lg">{t("screens.reminders.actions.add")}</Text>
					</Pressable>
				</View>

				<View className="mt-10 border-t border-gray-50 w-full pt-6">
					<Text className="text-center text-gray-400 font-medium italic">
						{t("screens.reminders.empty.footer")}
					</Text>
				</View>
			</Animated.View>
		</View>
	);
}
