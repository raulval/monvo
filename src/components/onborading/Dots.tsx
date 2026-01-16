import { Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type DotsProps = {
  count: number;
  activeIndex: number;
  onPress?: (index: number) => void;
};

export function Dots({ count, activeIndex, onPress }: DotsProps) {
  return (
    <View className="flex-row justify-center items-center gap-2">
      {Array.from({ length: count }).map((_, index) => {
        const active = index === activeIndex;

        const animatedStyle = useAnimatedStyle(() => ({
          width: withTiming(active ? 24 : 8, { duration: 250 }),
          opacity: withTiming(active ? 1 : 0.4, { duration: 250 }),
        }));

        return (
          <Pressable key={index} onPress={() => onPress?.(index)} hitSlop={10}>
            <Animated.View
              style={animatedStyle}
              className={`h-2 rounded-full ${
                active ? "bg-purple-500" : "bg-purple-300"
              }`}
            />
          </Pressable>
        );
      })}
    </View>
  );
}
