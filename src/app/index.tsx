import { Redirect, useRootNavigationState } from "expo-router";
import { storage, StorageKeys } from "@/utils/storage";
import { View, ActivityIndicator } from "react-native";

export default function App() {
	const rootNavigationState = useRootNavigationState();
	const hasFinishedOnboarding = storage.getBoolean(StorageKeys.HAS_FINISHED_ONBOARDING);

	if (!rootNavigationState?.key) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator size="large" color="#4f46e5" />
			</View>
		);
	}

	if (hasFinishedOnboarding) {
		return <Redirect href="/home" />;
	}

	return <Redirect href="/onboarding" />;
}
