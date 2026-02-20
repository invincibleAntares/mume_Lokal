import {
  createBottomTabNavigator,
  BottomTabBar,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";

import HomeScreen from "../screens/Home/HomeScreen";
import FavoritesScreen from "../screens/Favorites/FavoritesScreen";
import PlaylistsScreen from "../screens/Playlists/PlaylistsScreen";
import SettingsScreen from "../screens/Settings/SettingsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PlayerScreen from "../screens/Player/PlayerScreen";
import { HomeStackParamList } from "./types";
import MiniPlayer from "../components/MiniPlayer";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import SongListScreen from "../screens/SeeAll/SongListScreen";
import ArtistDetailScreen from "../screens/Artist/ArtistDetailScreen";
import ArtistsListScreen from "../screens/Artist/ArtistsListScreen";
import SearchScreen from "../screens/Search/SearchScreen";
import tw from "twrnc";
const Stack = createNativeStackNavigator<HomeStackParamList>();

const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />

      {/* Full Player as modal */}
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{
          presentation: "modal",
          animation: "slide_from_bottom",
        }}
      />

      <Stack.Screen name="ArtistDetail" component={ArtistDetailScreen} />
      <Stack.Screen name="ArtistsList" component={ArtistsListScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
    </Stack.Navigator>
  );
}

function CustomTabBar(props: BottomTabBarProps) {
  const { state } = props;

  const currentRoute = state.routes[state.index];
  const focusedRouteName =
    getFocusedRouteNameFromRoute(currentRoute) ?? currentRoute.name;

  const hideMiniPlayer = focusedRouteName === "Player";

  return (
    <View style={tw`relative`}>
      {!hideMiniPlayer && (
        <View
          style={[
            tw`absolute left-0 right-0 mx-0 mb-2 rounded-lg overflow-hidden`,
            {
              bottom: 60,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 8,
            },
          ]}
        >
          <MiniPlayer />
        </View>
      )}
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
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Playlists"
        component={PlaylistsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="list" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
