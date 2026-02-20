import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import { useTheme } from "../theme/ThemeContext";

import HomeScreen from "../screens/Home/HomeScreen";
import FavoritesScreen from "../screens/Favorites/FavoritesScreen";
import PlaylistsScreen from "../screens/Playlists/PlaylistsScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlayerScreen from "../screens/Player/PlayerScreen";
import { HomeStackParamList } from "./types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}

export default function BottomTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subText,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>❤️</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Playlists"
        component={PlaylistsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>📄</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 18 }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
