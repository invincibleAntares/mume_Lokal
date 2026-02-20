import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";

export default function SettingsScreen() {
  const { theme, toggleTheme, mode } = useTheme();

  return (
    <SafeAreaView
      style={[
        tw`flex-1 items-center justify-center`,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={{ color: theme.text, marginBottom: 16 }}>
        Current theme: {mode}
      </Text>

      <TouchableOpacity
        onPress={toggleTheme}
        style={[tw`px-4 py-2 rounded`, { backgroundColor: theme.primary }]}
      >
        <Text style={tw`text-white font-semibold`}>Toggle Theme</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
