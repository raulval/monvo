import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ArrowLeft, Edit2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, { useAnimatedStyle, interpolate, Extrapolation, SharedValue } from "react-native-reanimated";

interface Props {
	title: string;
	description?: string;
	progress: number;
	completedItems: number;
	totalItems: number;
	onEdit: () => void;
	scrollY: SharedValue<number>;
}

export function ChecklistHeader({
	title,
	description,
	progress,
	completedItems,
	totalItems,
	onEdit,
	scrollY,
}: Props) {
	const router = useRouter();
	const { t } = useTranslation();

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const height = interpolate(scrollY.value, [0, 200], [320, 140], Extrapolation.CLAMP);
		const borderRadius = interpolate(scrollY.value, [0, 200], [40, 0], Extrapolation.CLAMP);

		return {
			height,
			borderBottomLeftRadius: borderRadius,
			borderBottomRightRadius: borderRadius,
		};
	});

	const contentAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [0, 100], [1, 0], Extrapolation.CLAMP);
		const translateY = interpolate(scrollY.value, [0, 100], [0, -20], Extrapolation.CLAMP);

		return {
			opacity,
			transform: [{ translateY }],
		};
	});

	const compactAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [100, 180], [0, 1], Extrapolation.CLAMP);
		const translateY = interpolate(scrollY.value, [100, 180], [10, 0], Extrapolation.CLAMP);

		return {
			opacity,
			transform: [{ translateY }],
			display: scrollY.value > 80 ? "flex" : "none",
		};
	});

	return (
		<Animated.View
			style={[headerAnimatedStyle]}
			className="absolute top-0 left-0 right-0 z-50 bg-linear-to-b from-indigo-900 to-pink-600 px-6 shadow-2xl overflow-hidden"
		>
			{/* Top Bar (Fixed) */}
			<View className="flex-row items-center justify-between pt-16 mb-4 z-50">
				<Pressable onPress={() => router.back()} className="p-3 bg-white/20 rounded-2xl active:bg-white/30">
					<ArrowLeft size={24} color="white" />
				</Pressable>

				{/* Compact Header (appears on scroll) */}
				<Animated.View
					style={[compactAnimatedStyle]}
					className="flex-1 flex-row items-center justify-between mx-4"
				>
					<View className="flex-1 mr-2">
						<Text className="text-white font-bold text-lg" numberOfLines={1}>
							{title}
						</Text>
						<Text className="text-white/70 text-xs font-bold uppercase">
							{completedItems}/{totalItems}{" "}
							{t("screens.home.create_sheet.items_count", { count: totalItems }).split(" ")[1]}
						</Text>
					</View>
					<View className="items-end">
						<Text className="text-white text-xl font-black">{progress}%</Text>
					</View>
				</Animated.View>

				<Pressable onPress={onEdit} className="p-3 bg-white/20 rounded-2xl active:bg-white/30">
					<Edit2 size={20} color="white" />
				</Pressable>
			</View>

			{/* Large Content (fades out on scroll) */}
			<Animated.View style={[contentAnimatedStyle]}>
				<Text className="text-4xl font-black text-white mb-2 leading-tight" numberOfLines={2}>
					{title}
				</Text>

				{description && (
					<Text className="text-lg text-white/80 font-medium mb-6 leading-tight" numberOfLines={2}>
						{description}
					</Text>
				)}

				<View>
					<View className="flex-row justify-between items-end mb-3">
						<Text className="text-white/90 text-sm font-bold uppercase tracking-wider">
							{t("screens.details.general_progress")}
						</Text>
						<Text className="text-white text-3xl font-black">{progress}%</Text>
					</View>

					<View className="h-3 bg-black/10 rounded-full overflow-hidden border border-white/10 mb-2">
						<View className="h-full bg-white rounded-full shadow-sm" style={{ width: `${progress}%` }} />
					</View>

					<Text className="text-white/80 text-sm font-bold">
						{t("screens.details.items_count", { completed: completedItems, total: totalItems })}
					</Text>
				</View>
			</Animated.View>
		</Animated.View>
	);
}
