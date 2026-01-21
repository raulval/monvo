import { Redirect } from "expo-router";
import { storage, StorageKeys } from "@/utils/storage";

export default function App() {
	const hasFinishedOnboarding = storage.getBoolean(StorageKeys.HAS_FINISHED_ONBOARDING);

	if (hasFinishedOnboarding) {
		return <Redirect href="/home" />;
	}

	return <Redirect href="/onboarding" />;
}
