import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";
import { Song, useSongStore } from "../store/songStore";
import { getBestImage } from "../utils/getImage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/types";

export default function SongRow({ song }: { song: Song }) {
  const { theme } = useTheme();
  const setCurrentSong = useSongStore((s) => s.setCurrentSong);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

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
          {song.primaryArtists}
        </Text>
      </View>

      <TouchableOpacity onPress={() => setCurrentSong(song)}>
        <Text style={[tw`text-xl`, { color: theme.primary }]}>▶️</Text>
      </TouchableOpacity>
    </View>
  );
}
