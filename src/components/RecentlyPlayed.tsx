import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import tw from "twrnc";
import { useSongStore } from "../store/songStore";
import { useTheme } from "../theme/ThemeContext";
import { getBestImage } from "../utils/getImage";
import { getSongDisplayName } from "../utils/songHelpers";
import { useNavigation } from "@react-navigation/native";

export default function RecentlyPlayed() {
  const { recentlyPlayed, setCurrentSong } = useSongStore();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  if (recentlyPlayed.length === 0) return null;

  return (
    <View style={tw`mt-6`}>
      {/* Header */}
      <View style={tw`flex-row justify-between px-4 mb-3`}>
        <Text style={[tw`text-lg font-semibold`, { color: theme.text }]}>
          Recently Played
        </Text>
        <Text
          onPress={() =>
            navigation.navigate("SongList", {
              title: "Recently Played",
              songs: recentlyPlayed,
            })
          }
          style={[tw`text-sm`, { color: theme.primary }]}
        >
          See All
        </Text>
      </View>

      {/* Horizontal list */}
      <FlatList
        data={recentlyPlayed}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`px-4`}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={tw`mr-4 w-32`}
            onPress={() => {
              setCurrentSong(item);
              navigation.navigate("Player");
            }}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: getBestImage(item.image) }}
              style={tw`w-32 h-32 rounded-xl`}
            />
            <Text
              numberOfLines={2}
              style={[tw`mt-2 text-sm`, { color: theme.text }]}
            >
              {getSongDisplayName(item)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
