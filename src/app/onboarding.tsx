import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { storage, StorageKeys } from "@/utils/storage";

import { ChecklistIllustration } from "@/components/onborading/ChecklistIllustration";
import { AIIllustration } from "@/components/onborading/AIIllustration";
import { IconsIllustration } from "@/components/onborading/IconsIllustration";
import { Dots } from "@/components/onborading/Dots";
import { ChevronLeft } from "lucide-react-native";

export default function Onboarding() {
	const [currentScreen, setCurrentScreen] = useState(0);
	const router = useRouter();
	const { t } = useTranslation();

	const screens = [{ illustration: "checklist" }, { illustration: "icons" }, { illustration: "ai" }] as const;

	function handleNext() {
		if (currentScreen < screens.length - 1) {
			setCurrentScreen((prev) => prev + 1);
		} else {
			storage.set(StorageKeys.HAS_FINISHED_ONBOARDING, true);
			router.replace("/home");
		}
	}

	function handleBack() {
		if (currentScreen > 0) {
			setCurrentScreen((prev) => prev - 1);
		}
	}

	function handleSkip() {
		storage.set(StorageKeys.HAS_FINISHED_ONBOARDING, true);
		router.replace("/home");
	}

	const screen = screens[currentScreen];

	return (
		<View className="flex-1 bg-white">
			{/* Gradiente de fundo fixo */}
			<View className="absolute inset-0 bg-linear-to-b from-purple-50 via-indigo-50/30 to-white" />

			{/* Skip */}
			{currentScreen < screens.length - 1 && (
				<Pressable onPress={handleSkip} className="absolute right-5 top-12 z-20 px-4 py-2">
					<Text className="text-sm font-semibold text-indigo-900/60">{t("onboarding.skip")}</Text>
				</Pressable>
			)}

			{/* Content */}
			<View className="flex-1 px-6">
				<Animated.View
					key={currentScreen}
					entering={FadeInRight.duration(200).springify().damping(40)}
					exiting={FadeOutLeft.duration(200)}
					className="flex-1 items-center justify-center"
				>
					{/* Illustration container with some breathing room */}
					<View className="mb-16 min-h-[300px] items-center justify-center">
						{screen.illustration === "checklist" && <ChecklistIllustration />}
						{screen.illustration === "icons" && <IconsIllustration />}
						{screen.illustration === "ai" && <AIIllustration />}
					</View>

					<View className="w-full">
						<Text className="mb-4 text-center text-3xl font-bold tracking-tight text-indigo-950">
							{t(`onboarding.screens.${currentScreen}.headline`)}
						</Text>

						<Text className="px-4 text-center text-lg leading-6 text-gray-600">
							{t(`onboarding.screens.${currentScreen}.description`)}
						</Text>
					</View>
				</Animated.View>
			</View>

			{/* Bottom Controls */}
			<View className="px-6 pb-12">
				<Dots count={screens.length} activeIndex={currentScreen} onPress={setCurrentScreen} />

				<View className="mt-8 flex-row items-center gap-4">
					{currentScreen > 0 && (
						<Pressable
							onPress={handleBack}
							className="h-14 w-14 items-center justify-center rounded-2xl border-2 border-indigo-100 bg-white shadow-sm active:bg-indigo-50"
						>
							<ChevronLeft size={24} color="#312e81" />
						</Pressable>
					)}

					<Pressable
						onPress={handleNext}
						className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-900 to-pink-600 shadow-lg shadow-indigo-200 active:opacity-90"
					>
						<Text className="font-bold text-white text-lg">
							{currentScreen === screens.length - 1 ? t("onboarding.getStarted") : t("onboarding.next")}
						</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}
