import { View, Text, Image } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  FadeIn,
  withDelay,
} from "react-native-reanimated";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

function Dot({ delay, color }: { delay: number; color: string }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 400 }),
          withTiming(1, { duration: 400 })
        ),
        -1,
        false
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style} className={`h-2 w-2 rounded-full ${color}`} />
  );
}

export default function Splash() {
  const router = useRouter();

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 600 });
    opacity.value = withTiming(1, { duration: 600 });

    rotate.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 700 }),
        withTiming(-10, { duration: 700 }),
        withTiming(0, { duration: 700 })
      ),
      -1,
      true
    );

    const timeout = setTimeout(() => {
      // router.replace("/onboarding");
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return (
    <View className="flex-1 items-center justify-center bg-[#FDF4FF]">
      {/* <Animated.View style={logoStyle} className="items-center"> */}
      <Image source={require("@/assets/logo_icon.png")} className="w-32 h-32" />
      {/* <View className="mb-6 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-6 shadow-2xl">
          <Sparkles size={64} color="white" />
        </View> */}
      {/* </Animated.View> */}

      <Animated.View entering={FadeIn.delay(300)} className="-mt-8">
        <Image
          source={require("@/assets/logo.png")}
          className="w-52"
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text
        entering={FadeIn.delay(500)}
        className="text-lg font-medium text-indigo-950 -mt-15"
      >
        Everything ready
      </Animated.Text>
    </View>
  );
}
