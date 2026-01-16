import "../global.css";
import "react-native-reanimated";
import "@/i18n";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
