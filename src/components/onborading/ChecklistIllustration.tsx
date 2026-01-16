import { CheckSquare } from "lucide-react-native";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

export function ChecklistIllustration() {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));

  return (
    <View className="items-center">
      <View className="w-64 rounded-3xl bg-white p-8 shadow-xl">
        {[0, 1, 2].map((index) => (
          <View key={index} className="mb-4 flex-row items-center gap-3">
            <View
              className={`h-6 w-6 items-center justify-center rounded-lg ${
                index < 2
                  ? "bg-gradient-to-br from-indigo-900 to-pink-600"
                  : "border-2 border-gray-300"
              }`}
            >
              {index < 2 && <CheckSquare size={14} color="white" />}
            </View>
            <View
              className={`h-3 flex-1 rounded-full ${
                index < 2 ? "bg-gray-200" : "bg-gray-100"
              }`}
            />
          </View>
        ))}
      </View>

      <Animated.View
        style={floatStyle}
        className="absolute -right-4 -top-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-pink-600 p-3 shadow-lg"
      >
        <CheckSquare size={24} color="white" />
      </Animated.View>
    </View>
  );
}
