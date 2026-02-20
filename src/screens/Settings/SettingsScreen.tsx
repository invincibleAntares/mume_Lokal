import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();

  const themeOptions: Array<"light" | "dark" | "system"> = [
    "light",
    "dark",
    "system",
  ];

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={tw`px-4 py-3`}>
        <Text style={[tw`text-2xl font-bold`, { color: theme.text }]}>
          Settings
        </Text>
      </View>

      {/* Theme Section */}
      <View style={tw`px-4 mt-4`}>
        <Text
          style={[tw`text-sm font-semibold mb-3`, { color: theme.subText }]}
        >
          THEME
        </Text>

        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setMode(option)}
            style={[
              tw`flex-row items-center justify-between px-4 py-4 rounded-lg mb-2`,
              { backgroundColor: theme.card },
            ]}
          >
            <View style={tw`flex-row items-center`}>
              <Ionicons
                name={
                  option === "light"
                    ? "sunny"
                    : option === "dark"
                    ? "moon"
                    : "phone-portrait"
                }
                size={22}
                color={theme.text}
                style={tw`mr-3`}
              />
              <View>
                <Text
                  style={[tw`text-base font-medium`, { color: theme.text }]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
                {option === "system" && (
                  <Text style={[tw`text-xs mt-0.5`, { color: theme.subText }]}>
                    Follow system theme
                  </Text>
                )}
              </View>
            </View>

            {mode === option && (
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={theme.primary}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
