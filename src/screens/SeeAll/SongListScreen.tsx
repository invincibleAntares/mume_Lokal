import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";
import SongRow from "../../components/SongRow";

export default function SongListScreen({ route, navigation }: any) {
  const { title, songs } = route.params;
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={tw`px-4 py-3 flex-row items-center`}>
        <Text
          onPress={() => navigation.goBack()}
          style={[tw`text-xl mr-4`, { color: theme.text }]}
        >
          ⬅️
        </Text>
        <Text style={[tw`text-lg font-semibold`, { color: theme.text }]}>
          {title}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={songs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SongRow song={item} />}
      />
    </SafeAreaView>
  );
}
