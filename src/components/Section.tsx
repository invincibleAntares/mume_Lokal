import { View, Text } from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";

export default function Section({ title }: { title: string }) {
  const { theme } = useTheme();

  return (
    <View style={tw`flex-row justify-between items-center px-4 mt-6 mb-3`}>
      <Text style={[tw`text-lg font-semibold`, { color: theme.text }]}>
        {title}
      </Text>
      <Text style={[tw`text-sm`, { color: theme.primary }]}>See All</Text>
    </View>
  );
}
