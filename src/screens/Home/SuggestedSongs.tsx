import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { getBestImage } from "../../utils/getImage";
import { useSongStore } from "../../store/songStore";

interface SuggestedSongsProps {
  songs: any[];
  loading: boolean;
}

export default function SuggestedSongs({
  songs,
  loading,
}: SuggestedSongsProps) {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View style={tw`mt-6`}>
      <View style={tw`flex-row justify-between px-4 mb-3`}>
        <Text style={[tw`text-lg font-semibold`, { color: theme.text }]}>
          Suggested Songs
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("SongList", {
              title: "Suggested Songs",
              songs: songs,
            })
          }
        >
          <Text style={[tw`text-sm`, { color: theme.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={tw`mt-4 ml-4`} />
      ) : (
        <FlatList
          data={songs.slice(0, 10)}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={tw`px-4`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={tw`mr-4 w-32`}
              onPress={() => {
                useSongStore.getState().setCurrentSong(item);
                navigation.navigate("Player");
              }}
              activeOpacity={0.8}
            >
              <Image
                source={{ uri: getBestImage(item.image) }}
                style={tw`w-32 h-32 rounded-xl bg-gray-400`}
              />
              <Text
                numberOfLines={2}
                style={[tw`mt-2 text-sm`, { color: theme.text }]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
