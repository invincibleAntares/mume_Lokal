import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";
import { useSongStore } from "../../store/songStore";
import SongRow from "../../components/SongRow";
import { getBestImage } from "../../utils/getImage";
import { useEffect, useState } from "react";
import { getArtistSongs } from "../../api/saavn";
import { Ionicons } from "@expo/vector-icons";

export default function ArtistDetailScreen({ route, navigation }: any) {
  const { artist } = route.params;
  const { theme } = useTheme();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { songs: storeSongs } = useSongStore();

  useEffect(() => {
    loadArtistSongs();
  }, [artist.id]);

  const loadArtistSongs = async () => {
    try {
      setLoading(true);
      const artistSongs = await getArtistSongs(artist.id);
      setSongs(artistSongs);
      // Update the store so songs can be played with next/prev functionality
      useSongStore.setState({ songs: artistSongs });
    } catch (error) {
      console.error("Failed to load artist songs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={tw`px-4 py-3 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[tw`text-lg font-semibold`, { color: theme.text }]}>
          Artist
        </Text>
      </View>

      {/* Artist Info */}
      <View style={tw`items-center mt-6`}>
        <Image
          source={{ uri: getBestImage(artist.image) }}
          style={tw`w-32 h-32 rounded-full`}
        />
        <Text style={[tw`text-xl font-bold mt-4`, { color: theme.text }]}>
          {artist.name}
        </Text>
      </View>

      {/* Songs */}
      {loading ? (
        <ActivityIndicator style={tw`mt-10`} size="large" />
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SongRow song={item} />}
          contentContainerStyle={tw`mt-6`}
        />
      )}
    </SafeAreaView>
  );
}
