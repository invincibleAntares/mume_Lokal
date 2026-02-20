import { View, Text } from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";

export default function Header() {
  const { theme } = useTheme();

  return (
    <View style={tw`px-4 py-4 flex-row justify-between items-center`}>
      <View style={tw`flex-row items-center`}>
        <Text style={[tw`text-2xl mr-2`, { color: theme.primary }]}>🎵</Text>
        <Text style={[tw`text-2xl font-bold`, { color: theme.text }]}>
          Mume
        </Text>
      </View>

      <Text style={[tw`text-xl`, { color: theme.text }]}>🔍</Text>
    </View>
  );
}
