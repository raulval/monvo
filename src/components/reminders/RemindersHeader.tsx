import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Animated, { useAnimatedStyle, interpolate, Extrapolation, SharedValue } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Bell } from "lucide-react-native";

interface RemindersHeaderProps {
	scrollY: SharedValue<number>;
}

export function RemindersHeader({ scrollY }: RemindersHeaderProps) {
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();

	const headerStyle = useAnimatedStyle(() => {
		const height = interpolate(scrollY.value, [0, 100], [140, 70], Extrapolation.CLAMP);
		return {
			height: height + insets.top,
		};
	});

	const blurStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [20, 80], [0, 1], Extrapolation.CLAMP);
		return { opacity };
	});

	const iconStyle = useAnimatedStyle(() => {
		const scale = interpolate(scrollY.value, [0, 100], [1, 0.7], Extrapolation.CLAMP);
		const translateX = interpolate(scrollY.value, [0, 100], [0, -10], Extrapolation.CLAMP);
		const translateY = interpolate(scrollY.value, [0, 100], [0, -20], Extrapolation.CLAMP);
		return {
			transform: [{ scale }, { translateX }, { translateY }],
		};
	});

	const titleStyle = useAnimatedStyle(() => {
		const scale = interpolate(scrollY.value, [0, 100], [1, 0.75], Extrapolation.CLAMP);
		const translateX = interpolate(scrollY.value, [0, 100], [0, -35], Extrapolation.CLAMP);
		return {
			transform: [{ scale }, { translateX }],
		};
	});

	const subtitleStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [0, 40], [1, 0], Extrapolation.CLAMP);
		return { opacity };
	});

	return (
		<Animated.View
			style={[
				{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 50,
					overflow: "hidden",
				},
				headerStyle,
			]}
		>
			{/* Background layer */}
			<View className="absolute inset-0 -z-10" />

			{/* Blur layer */}
			<Animated.View style={[{ flex: 1 }, blurStyle]}>
				<BlurView intensity={60} tint="light" className="flex-1" />
				<View className="absolute bottom-0 left-0 right-0 h-px bg-gray-200/50" />
			</Animated.View>

			{/* Header Content */}
			<View
				className="absolute left-0 right-0 flex-row items-center gap-4 px-6"
				style={{ top: insets.top + 10 }}
			>
				<Animated.View
					style={iconStyle}
					className="w-14 h-14 bg-linear-to-br from-indigo-900 to-pink-600 rounded-2xl items-center justify-center shadow-lg shadow-purple-200"
				>
					<Bell size={28} color="white" fill="white" />
				</Animated.View>
				<View className="flex-1">
					<Animated.Text
						style={titleStyle}
						className="text-[32px] font-black text-gray-900 tracking-tight leading-tight origin-left"
					>
						{t("screens.reminders.header.title")}
					</Animated.Text>
					<Animated.View style={subtitleStyle}>
						<Text className="text-gray-400 font-semibold mt-[-2]">
							{t("screens.reminders.header.subtitle")}
						</Text>
					</Animated.View>
				</View>
			</View>
		</Animated.View>
	);
}
