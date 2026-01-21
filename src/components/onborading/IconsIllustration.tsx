import { Plane, Home, Heart } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
	useAnimatedStyle,
	withDelay,
} from "react-native-reanimated";

export function IconsIllustration() {
	const icons = [
		{ Icon: Plane, colors: "from-blue-400 to-blue-600", delay: 0 },
		{ Icon: Home, colors: "from-pink-400 to-pink-600", delay: 200 },
		{ Icon: Heart, colors: "from-red-400 to-red-600", delay: 400 },
	];

	return (
		<View className="flex-row gap-4">
			{icons.map(({ Icon, colors, delay }, index) => (
				<FloatingIcon key={index} Icon={Icon} colors={colors} delay={delay} />
			))}
		</View>
	);
}

function FloatingIcon({ Icon, colors, delay }: any) {
	const y = useSharedValue(0);

	useEffect(() => {
		y.value = withDelay(
			delay,
			withRepeat(withSequence(withTiming(-8, { duration: 1200 }), withTiming(0, { duration: 1200 })), -1),
		);
	}, []);

	const style = useAnimatedStyle(() => ({
		transform: [{ translateY: y.value }],
	}));

	return (
		<Animated.View style={style} className={`rounded-3xl bg-linear-to-br ${colors} p-8 shadow-xl`}>
			<Icon size={48} color="white" />
		</Animated.View>
	);
}
