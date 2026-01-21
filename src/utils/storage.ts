import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

export const StorageKeys = {
	HAS_FINISHED_ONBOARDING: "has_finished_onboarding",
};
