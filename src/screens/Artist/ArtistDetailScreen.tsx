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
import { decodeHtmlEntities } from "../../utils/decodeHtmlEntities";
import { useEffect, useState } from "react";
import { getArtistSongs } from "../../api/saavn";
import { Ionicons } from "@expo/vector-icons";

export default function ArtistDetailScreen({ route, navigation }: any) {
  const { artist } = route.params;
  const { theme } = useTheme();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    setCurrentSong,
    currentSong,
    isPlaying,
    togglePlay,
    setShuffleEnabled,
  } = useSongStore();

  useEffect(() => {
    loadArtistSongs();
  }, [artist.id]);

  const loadArtistSongs = async () => {
    try {
      setLoading(true);
      const artistSongs = await getArtistSongs(artist.id);
      setSongs(artistSongs);
      useSongStore.setState({ songs: artistSongs });
    } catch (error) {
      console.error("Failed to load artist songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const playAll = () => {
    if (songs.length > 0) {
      setShuffleEnabled(false);
      useSongStore.setState({ songs });
      const firstSong = songs[0];
      if (currentSong?.id === firstSong.id) {
        togglePlay();
      } else {
        setCurrentSong(firstSong);
        navigation.navigate("Player");
      }
    }
  };

  const playShuffle = () => {
    if (songs.length === 0) return;
    useSongStore.setState({ songs });
    useSongStore.getState().setShuffleEnabled(true);
    const { songs: storeSongs, shuffledIndices } = useSongStore.getState();
    const firstIdx = shuffledIndices[0];
    if (firstIdx !== undefined && storeSongs[firstIdx]) {
      setCurrentSong(storeSongs[firstIdx]);
      navigation.navigate("Player");
    }
  };

  // Check if any song from this artist is currently playing
  const isArtistPlaying =
    currentSong && songs.some((s) => s.id === currentSong.id) && isPlaying;

  const ListHeader = () => (
    <View style={tw`mb-4`}>
      {/* Artist Hero Section */}
      <View style={tw`items-center px-6 pt-6 pb-8`}>
        {/* Large Image with Shadow */}
        <View
          style={[
            tw`shadow-lg`,
            {
              shadowColor: theme.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            },
          ]}
        >
          <Image
            source={{ uri: getBestImage(artist.image) }}
            style={tw`w-64 h-64 rounded-[35px]`}
          />
        </View>

        {/* Artist Name */}
        <Text
          style={[
            tw`text-3xl font-bold mt-8 text-center tracking-wide`,
            { color: theme.text },
          ]}
        >
          {decodeHtmlEntities(artist.name)}
        </Text>

        {/* Stats Row (Mimicking the "1 Album | 20 Songs" style) */}
        <View style={tw`flex-row items-center mt-3 opacity-70`}>
          <Text style={[tw`text-sm font-medium`, { color: theme.text }]}>
            1 Album
          </Text>
          <Text style={[tw`mx-3 text-sm`, { color: theme.subText }]}>|</Text>
          <Text style={[tw`text-sm font-medium`, { color: theme.text }]}>
            {songs.length} Songs
          </Text>
          {/* Optional: Add duration if you have the data, otherwise leave it clean */}
        </View>

        {/* Shuffle and Play buttons (like reference) */}
        {!loading && songs.length > 0 && (
          <View style={tw`w-full flex-row mt-8 px-2`}>
            <TouchableOpacity
              onPress={playShuffle}
              activeOpacity={0.8}
              style={[
                tw`flex-1 flex-row items-center justify-center py-4 rounded-full shadow-md mr-2`,
                { backgroundColor: theme.primary },
              ]}
            >
              <Ionicons
                name="shuffle"
                size={22}
                color="white"
                style={tw`mr-2`}
              />
              <Text style={tw`text-white font-bold text-base tracking-wide`}>
                Shuffle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={playAll}
              activeOpacity={0.8}
              style={[
                tw`flex-1 flex-row items-center justify-center py-4 rounded-full border-2`,
                { borderColor: theme.primary, backgroundColor: theme.card },
              ]}
            >
              <Ionicons
                name={isArtistPlaying ? "pause" : "play"}
                size={22}
                color={theme.primary}
                style={tw`mr-2`}
              />
              <Text
                style={[
                  tw`font-bold text-base tracking-wide`,
                  { color: theme.primary },
                ]}
              >
                {isArtistPlaying ? "Pause" : "Play"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Section Header: Songs & See All */}
      {!loading && songs.length > 0 && (
        <View style={tw`flex-row items-center justify-between px-6 mt-2 mb-2`}>
          <Text style={[tw`text-xl font-bold`, { color: theme.text }]}>
            Songs
          </Text>
          <TouchableOpacity>
            <Text style={[tw`text-sm font-semibold`, { color: theme.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      {/* Top Navigation Bar */}
      <View
        style={tw`px-4 py-3 flex-row items-center absolute z-10 top-10 left-0`}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 rounded-full bg-black/20`} // Subtle background for visibility over content
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={songs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SongRow song={item} />}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={tw`pb-32 pt-12`} // Added top padding for the absolute header
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
