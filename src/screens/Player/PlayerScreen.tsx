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
    queue,
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

        <TouchableOpacity
          onPress={() => navigation.navigate("Queue")}
          style={tw`relative`}
        >
          <Ionicons name="list" size={28} color={theme.text} />
          {queue.length > 0 && (
            <View
              style={[
                tw`absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center`,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={tw`text-white text-xs font-bold`}>
                {queue.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Artwork */}
      <View style={tw`items-center mt-6`}>
        <Image
          source={{ uri: getBestImage(currentSong.image) }}
          style={tw`w-72 h-72 rounded-2xl bg-gray-300`}
        />
      </View>

      {/* Song Info */}
      <View style={tw`items-center mt-8 px-6`}>
        <Text
          style={[tw`text-3xl font-bold text-center`, { color: theme.text }]}
          numberOfLines={2}
        >
          {currentSong.name}
        </Text>
        <Text style={[tw`text-lg mt-3 text-center`, { color: theme.subText }]}>
          {getPrimaryArtists(currentSong)}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={tw`px-6 mt-10`}>
        <Pressable
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            const barWidth = 300; // matches visual width
            const ratio = Math.min(Math.max(locationX / barWidth, 0), 1);
            seek(ratio);
          }}
        >
          <View
            style={[
              tw`h-1.5 rounded-full`,
              { backgroundColor: theme.subText + "40" },
            ]}
          >
            <View
              style={[
                tw`h-1.5 rounded-full`,
                {
                  width: `${progress * 100}%`,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
        </Pressable>

        <View style={tw`flex-row justify-between mt-3`}>
          <Text style={[tw`text-sm font-medium`, { color: theme.subText }]}>
            {formatTime(positionMillis)}
          </Text>
          <Text style={[tw`text-sm font-medium`, { color: theme.subText }]}>
            {formatTime(durationMillis)}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={tw`flex-row justify-center items-center mt-12 px-12`}>
        <TouchableOpacity onPress={playPrevious} style={tw`mx-8`}>
          <Ionicons name="play-skip-back" size={40} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={togglePlay}
          style={[
            tw`mx-8 p-5 rounded-full`,
            { backgroundColor: theme.primary },
          ]}
        >
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={36}
            color="white"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={playNext} style={tw`mx-8`}>
          <Ionicons name="play-skip-forward" size={40} color={theme.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
