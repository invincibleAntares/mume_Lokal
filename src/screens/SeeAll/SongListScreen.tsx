import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";
import SongRow from "../../components/SongRow";
import { Ionicons } from "@expo/vector-icons";

export default function SongListScreen({ route, navigation }: any) {
  const { title, songs } = route.params;
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={tw`px-4 py-3`}>
        <View style={tw`flex-row items-center mb-2`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`mr-4`}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[tw`text-xl font-bold flex-1`, { color: theme.text }]}>
            {title}
          </Text>
        </View>
        <Text style={[tw`text-sm ml-12`, { color: theme.subText }]}>
          {songs.length} {songs.length === 1 ? "song" : "songs"}
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
