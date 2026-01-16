import { Sparkles } from "lucide-react-native";
import { useEffect } from "react";
import { View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  useAnimatedStyle,
  Easing,
} from "react-native-reanimated";

const ORBIT_RADIUS = 155;
const PARTICLE_COUNT = 5;

export function AIIllustration() {
  const scaleIn = useSharedValue(0.9);
  const opacityIn = useSharedValue(0);

  useEffect(() => {
    scaleIn.value = withTiming(1, { duration: 500 });
    opacityIn.value = withTiming(1, { duration: 500 });
  }, []);

  const entryStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleIn.value }],
    opacity: opacityIn.value,
  }));

  return (
    <View className="items-center justify-center">
      <Animated.View
        style={entryStyle}
        className="relative items-center justify-center"
      >
        {/* Centro */}
        <Animated.View className="rounded-full bg-gradient-to-br from-indigo-900 to-pink-600 p-10 shadow-2xl">
          <Sparkles size={64} color="white" />
        </Animated.View>

        {/* Órbitas */}
        {[0, 1, 2].map((index) => (
          <OrbitDot key={index} index={index} />
        ))}
      </Animated.View>

      {/* Partículas flutuantes */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <FloatingParticle key={i} delay={i * 400} />
      ))}
    </View>
  );
}

/* ---------- Orbit Dot ---------- */

function OrbitDot({ index }: { index: number }) {
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 8000,
        easing: Easing.linear,
      }),
      -1
    );

    pulse.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value + index * 120}deg` }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View style={orbitStyle} className="absolute">
      <Animated.View
        style={pulseStyle}
        className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-900 to-pink-600 shadow-lg"
      />
      <View style={{ height: ORBIT_RADIUS }} />
    </Animated.View>
  );
}

/* ---------- Floating Particle ---------- */

function FloatingParticle({ delay }: { delay: number }) {
  const y = useSharedValue(0);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(-20, { duration: 1500 }),
        withTiming(0, { duration: 1500 })
      ),
      -1,
      true
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 })
      ),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: "absolute",
          top: Math.random() * 200,
          left: Math.random() * 200,
        },
      ]}
      className="h-2 w-2 rounded-full bg-purple-400"
    />
  );
}
