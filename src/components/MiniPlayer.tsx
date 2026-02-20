import { View, Text, TouchableOpacity, Image } from "react-native";
import tw from "twrnc";
import { useSongStore } from "../store/songStore";
import { useTheme } from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { getBestImage } from "../utils/getImage";

export default function MiniPlayer() {
  const { currentSong, isPlaying, togglePlay } = useSongStore();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => navigation.navigate("Player")}
      style={[
        tw`flex-row items-center px-3 py-2`,
        {
          backgroundColor: theme.card,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
      ]}
    >
      {/* Artwork */}
      <Image
        source={{ uri: getBestImage(currentSong.image) }}
        style={tw`w-10 h-10 rounded-md mr-3 bg-gray-700`}
      />

      {/* Song title */}
      <View style={tw`flex-1`}>
        <Text
          numberOfLines={1}
          style={[tw`text-sm font-medium`, { color: theme.text }]}
        >
          {currentSong.name} – {currentSong.primaryArtists}
        </Text>
      </View>

      {/* Controls */}
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          style={tw`px-2`}
        >
          <Text style={[tw`text-xl`, { color: theme.primary }]}>
            {isPlaying ? "⏸️" : "▶️"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            // next song later
          }}
          style={tw`px-2`}
        >
          <Text style={[tw`text-lg`, { color: theme.primary }]}>⏭️</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
