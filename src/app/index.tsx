import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initApp() {
      try {
        // carregar fontes, auth, storage, etc
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } finally {
        setIsReady(true);
      }
    }

    initApp();
  }, []);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) return null;

  return <Redirect href="/onboarding" />;
}
