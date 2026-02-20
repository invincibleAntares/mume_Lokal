import { View, Text } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeContext";

export default function Header() {
  const { theme } = useTheme();

  return (
    <View style={tw`px-4 py-4 flex-row justify-between items-center`}>
      <View style={tw`flex-row items-center`}>
        <Ionicons
          name="musical-notes"
          size={28}
          color={theme.primary}
          style={tw`mr-2`}
        />
        <Text style={[tw`text-2xl font-bold`, { color: theme.text }]}>
          Mume
        </Text>
      </View>

      <Ionicons name="search" size={24} color={theme.text} />
    </View>
  );
}
