import React from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import Animated, { Extrapolation, interpolate, useAnimatedStyle, SharedValue } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Plus } from "lucide-react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface HomeHeaderProps {
	scrollY: SharedValue<number>;
	onNewChecklistPress: () => void;
}

export function HomeHeader({ scrollY, onNewChecklistPress }: HomeHeaderProps) {
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();

	const headerAnimatedStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [20, 100], [0, 1], Extrapolation.CLAMP);

		return {
			opacity,
			backgroundColor: `rgba(255, 255, 255, ${opacity * 0.4})`,
		};
	});

	const buttonAnimatedStyle = useAnimatedStyle(() => {
		const width = interpolate(scrollY.value, [20, 100], [160, 48], Extrapolation.CLAMP);

		return { width, height: 48 };
	});

	const buttonTextStyle = useAnimatedStyle(() => {
		const opacity = interpolate(scrollY.value, [20, 100], [1, 0], Extrapolation.CLAMP);

		return {
			opacity,
			display: scrollY.value > 70 ? "none" : "flex",
		};
	});

	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 50,
				paddingTop: insets.top,
			}}
		>
			<Animated.View style={[StyleSheet.absoluteFill, headerAnimatedStyle]}>
				<BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
				<View className="absolute bottom-0 left-0 right-0 h-px bg-gray-200/50" />
			</Animated.View>

			<View className="px-6 py-4 flex-row justify-between items-center">
				<Image source={require("@/assets/logo.png")} className="w-32 h-10" resizeMode="contain" />

				<AnimatedPressable
					onPress={onNewChecklistPress}
					style={buttonAnimatedStyle}
					className="rounded-2xl flex-row bg-linear-to-r from-indigo-900 to-pink-600 items-center justify-center overflow-hidden"
				>
					<View className="flex-row items-center justify-center px-4 gap-2">
						<Plus size={20} color="white" />
						<Animated.Text numberOfLines={1} style={buttonTextStyle} className="text-white font-bold">
							{t("screens.home.header.new_checklist")}
						</Animated.Text>
					</View>
				</AnimatedPressable>
			</View>
		</View>
	);
}
