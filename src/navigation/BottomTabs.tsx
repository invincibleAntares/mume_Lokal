import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

import HomeScreen from "../screens/Home/HomeScreen";
import FavoritesScreen from "../screens/Favorites/FavoritesScreen";
import PlaylistsScreen from "../screens/Playlists/PlaylistsScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlayerScreen from "../screens/Player/PlayerScreen";
import { HomeStackParamList } from "./types";
import MiniPlayer from "../components/MiniPlayer";

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

function CustomTabBar(props: any) {
  return (
    <View>
      <MiniPlayer />
      <BottomTabBar {...props} />
    </View>
  );
}

export default function BottomTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          height: 56,
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
