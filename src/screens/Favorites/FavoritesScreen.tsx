import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";

export default function FavoritesScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      style={[
        tw`flex-1 items-center justify-center`,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={{ color: theme.text }}>Favorites</Text>
    </SafeAreaView>
  );
}
