import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/theme/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";
import { useEffect } from "react";
import { useSongStore } from "./src/store/songStore";
import { useOfflineStore } from "./src/store/offlineStore";

function Bootstrap() {
  const hydratePlayer = useSongStore((s) => s.hydratePlayer);

  useEffect(() => {
    hydratePlayer();
    useSongStore.getState().hydrateRecentlyPlayed();
    useSongStore.getState().hydrateQueue();
    useOfflineStore.getState().hydrateOffline();
  }, []);

  return null;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Bootstrap />
          <AppNavigator />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
