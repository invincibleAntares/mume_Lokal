import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";
import { Song, useSongStore } from "../store/songStore";
import { getBestImage } from "../utils/getImage";
import { getPrimaryArtists } from "../utils/songHelpers";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";

export default function SongRow({ song }: { song: Song }) {
  const { theme } = useTheme();
  const { setCurrentSong, currentSong, isPlaying } = useSongStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const isCurrentSong = currentSong?.id === song.id;

  return (
    <View
      style={[
        tw`flex-row items-center px-4 py-3`,
        { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          setCurrentSong(song);
          navigation.navigate("Player");
        }}
      >
        <Image
          source={{ uri: getBestImage(song.image) }}
          style={tw`w-12 h-12 rounded-md mr-3 bg-gray-300`}
        />
      </TouchableOpacity>

      <View style={tw`flex-1`}>
        <Text
          style={[tw`text-base font-medium`, { color: theme.text }]}
          numberOfLines={1}
        >
          {song.name}
        </Text>
        <Text style={[tw`text-sm`, { color: theme.subText }]} numberOfLines={1}>
          {getPrimaryArtists(song)}
        </Text>
      </View>

      <TouchableOpacity onPress={() => setCurrentSong(song)}>
        <Ionicons
          name={isCurrentSong && isPlaying ? "pause" : "play"}
          size={24}
          color={theme.primary}
        />
      </TouchableOpacity>
    </View>
  );
}
