import "../global.css";
import "react-native-reanimated";
import "@/utils/reactotron.config";
import "@/i18n";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "@gorhom/portal";
import { initializeDatabase } from "@/database/initialize";
import { useState, useEffect, useCallback } from "react";
import { SQLiteProvider, SQLiteDatabase } from "expo-sqlite";
import { queryClient } from "@/utils/queryClient";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [appIsReady, setAppIsReady] = useState(false);

	const handleInitDB = useCallback(async (db: SQLiteDatabase) => {
		try {
			await initializeDatabase(db);
			setAppIsReady(true);
		} catch (e) {
			console.error("Falha ao inicializar banco:", e);
		}
	}, []);

	useEffect(() => {
		if (appIsReady) {
			SplashScreen.hideAsync();
		}
	}, [appIsReady]);

	return (
		<QueryClientProvider client={queryClient}>
			<GestureHandlerRootView>
				<PortalProvider>
					<SQLiteProvider databaseName="monvo.db" onInit={handleInitDB}>
						<Stack screenOptions={{ headerShown: false }}>
							<Stack.Screen name="(tabs)" />
							<Stack.Screen name="onboarding" />
							<Stack.Screen name="checklist/[id]" />
						</Stack>
					</SQLiteProvider>
				</PortalProvider>
			</GestureHandlerRootView>
		</QueryClientProvider>
	);
}
