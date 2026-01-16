import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

import { ChecklistIllustration } from "@/components/onborading/ChecklistIllustration";
import { AIIllustration } from "@/components/onborading/AIIllustration";
import { IconsIllustration } from "@/components/onborading/IconsIllustration";
import { Dots } from "@/components/onborading/Dots";
import { ChevronLeft } from "lucide-react-native";

export default function Onboarding() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const router = useRouter();
  const { t } = useTranslation();

  const screens = [
    { illustration: "checklist" },
    { illustration: "icons" },
    { illustration: "ai" },
  ] as const;

  function handleNext() {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen((prev) => prev + 1);
    } else {
      router.replace("/home");
    }
  }

  function handleBack() {
    if (currentScreen > 0) {
      setCurrentScreen((prev) => prev - 1);
    }
  }

  function handleSkip() {
    router.replace("/home");
  }

  const screen = screens[currentScreen];

  return (
    <View className="flex-1 bg-gradient-to-b from-purple-50 via-pink-50 to-white">
      {/* Skip */}
      {currentScreen < screens.length - 1 && (
        <Pressable
          onPress={handleSkip}
          className="absolute right-5 top-12 z-10 px-4 py-2"
        >
          <Text className="text-sm font-medium text-gray-500">
            {t("onboarding.skip")}
          </Text>
        </Pressable>
      )}

      {/* Content */}
      <View className="flex-1 items-center justify-center px-6">
        <Animated.View
          key={currentScreen}
          entering={FadeInRight.duration(300)}
          exiting={FadeOutLeft.duration(300)}
          className="items-center"
        >
          {/* Illustration */}
          <View className="mb-12">
            {screen.illustration === "checklist" && <ChecklistIllustration />}
            {screen.illustration === "icons" && <IconsIllustration />}
            {screen.illustration === "ai" && <AIIllustration />}
          </View>

          <Text className="mb-4 px-4 text-center text-3xl font-bold text-gray-900">
            {t(`onboarding.screens.${currentScreen}.headline`)}
          </Text>

          <Text className="px-4 text-center text-lg text-gray-600">
            {t(`onboarding.screens.${currentScreen}.description`)}
          </Text>
        </Animated.View>
      </View>

      {/* Bottom */}
      <View className="px-6 pb-12">
        <Dots
          count={screens.length}
          activeIndex={currentScreen}
          onPress={setCurrentScreen}
        />

        <View className="mt-6 flex-row items-center gap-3">
          {currentScreen > 0 && (
            <Pressable
              onPress={handleBack}
              className="rounded-xl border-2 border-gray-200 p-4"
            >
              <ChevronLeft size={24} />
            </Pressable>
          )}

          <Pressable
            onPress={handleNext}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-900 to-pink-600 py-4"
          >
            <Text className="font-semibold text-white text-base">
              {currentScreen === screens.length - 1
                ? t("onboarding.getStarted")
                : t("onboarding.next")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
