import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useSongStore } from "../../store/songStore";
import { useTheme } from "../../theme/ThemeContext";
import { getBestImage } from "../../utils/getImage";
import { getPrimaryArtists } from "../../utils/songHelpers";
import { Pressable } from "react-native";

export default function PlayerScreen({ navigation }: any) {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    positionMillis,
    durationMillis,
    seek,
    playPrevious,
    playNext,
  } = useSongStore();

  const { theme } = useTheme();

  if (!currentSong) return null;

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = durationMillis > 0 ? positionMillis / durationMillis : 0;

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={tw`px-4 py-3 flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-down" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[tw`text-sm`, { color: theme.subText }]}>Now Playing</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Artwork */}
      <View style={tw`items-center mt-6`}>
        <Image
          source={{ uri: getBestImage(currentSong.image) }}
          style={tw`w-72 h-72 rounded-2xl bg-gray-300`}
        />
      </View>

      {/* Song Info */}
      <View style={tw`items-center mt-6 px-6`}>
        <Text
          style={[tw`text-xl font-semibold text-center`, { color: theme.text }]}
          numberOfLines={2}
        >
          {currentSong.name}
        </Text>
        <Text style={[tw`text-sm mt-2 text-center`, { color: theme.subText }]}>
          {getPrimaryArtists(currentSong)}
        </Text>
      </View>

      {/* Progress Bar (UI only) */}
      <View style={tw`px-6 mt-8`}>
        <Pressable
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            const barWidth = 300; // matches visual width
            const ratio = Math.min(Math.max(locationX / barWidth, 0), 1);
            seek(ratio);
          }}
        >
          <View style={tw`h-1 bg-gray-600 rounded-full`}>
            <View
              style={[
                tw`h-1 rounded-full`,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
        </Pressable>

        <View style={tw`flex-row justify-between mt-2`}>
          <Text style={[tw`text-xs`, { color: theme.subText }]}>
            {formatTime(positionMillis)}
          </Text>
          <Text style={[tw`text-xs`, { color: theme.subText }]}>
            {formatTime(durationMillis)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={tw`flex-row justify-center items-center mt-10`}>
        <TouchableOpacity>
          <Ionicons name="shuffle" size={28} color={theme.subText} />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPrevious}>
          <Ionicons name="play-skip-back" size={36} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlay}
          style={[
            tw`mx-6 p-4 rounded-full`,
            { backgroundColor: theme.primary },
          ]}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={32}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext}>
          <Ionicons name="play-skip-forward" size={36} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="repeat" size={28} color={theme.subText} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
