import { BottomNav } from "@/components/bottom-nav/BottomNav";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
	const { t } = useTranslation();

	return (
		<Tabs tabBar={(props) => <BottomNav {...props} />} screenOptions={{ headerShown: false }}>
			<Tabs.Screen name="index" options={{ title: t("tabs.home") }} />
			<Tabs.Screen name="reminders" options={{ title: t("tabs.reminders") }} />
			{/* <Tabs.Screen name="history" options={{ title: t("tabs.history") }} />
			<Tabs.Screen name="settings" options={{ title: t("tabs.settings") }} /> */}
		</Tabs>
	);
}
