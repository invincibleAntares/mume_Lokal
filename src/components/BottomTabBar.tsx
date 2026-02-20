import { View, Text, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";

const TABS = [
  { key: "Home", icon: "🏠" },
  { key: "Favorites", icon: "❤️" },
  { key: "Playlists", icon: "📄" },
  { key: "Settings", icon: "⚙️" },
];

export default function BottomTabBar() {
  const { theme } = useTheme();
  const activeTab = "Home"; // static for now

  return (
    <View
      style={[
        tw`flex-row justify-around items-center py-3`,
        {
          backgroundColor: theme.background,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
      ]}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;

        return (
          <TouchableOpacity key={tab.key} style={tw`items-center`}>
            <Text
              style={[
                tw`text-xl`,
                { color: isActive ? theme.primary : theme.subText },
              ]}
            >
              {tab.icon}
            </Text>
            <Text
              style={[
                tw`text-xs mt-1`,
                { color: isActive ? theme.primary : theme.subText },
              ]}
            >
              {tab.key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
