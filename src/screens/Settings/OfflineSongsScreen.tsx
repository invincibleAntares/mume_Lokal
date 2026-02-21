import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";
import { useOfflineStore } from "../../store/offlineStore";
import { useSongStore } from "../../store/songStore";
import { getBestImage } from "../../utils/getImage";
import { getPrimaryArtists, getSongDisplayName } from "../../utils/songHelpers";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { SettingsStackParamList } from "../../navigation/types";

export default function OfflineSongsScreen() {
  const { theme } = useTheme();
  const { downloads, removeDownload } = useOfflineStore();
  const { setCurrentSong } = useSongStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<SettingsStackParamList>>();

  const handlePlay = (song: (typeof downloads)[0]["song"]) => {
    setCurrentSong(song);
    // Open full Player (lives in Home stack) from Settings tab
    const tab = navigation.getParent();
    if (tab) {
      (tab as any).navigate("Home", { screen: "Player" });
    }
  };

  return (
    <SafeAreaView
      style={[tw`flex-1`, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <View
        style={[
          tw`flex-row items-center px-4 py-3`,
          { borderBottomWidth: 1, borderBottomColor: theme.border },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-3`}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[tw`text-xl font-semibold`, { color: theme.text }]}>
          Offline songs
        </Text>
      </View>

      {downloads.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Ionicons
            name="cloud-download-outline"
            size={64}
            color={theme.subText}
          />
          <Text
            style={[tw`text-lg mt-4 text-center`, { color: theme.subText }]}
          >
            No offline songs
          </Text>
          <Text
            style={[tw`text-sm mt-2 text-center`, { color: theme.subText }]}
          >
            Download songs from the 3-dot menu on any song to play without
            network.
          </Text>
        </View>
      ) : (
        <FlatList
          data={downloads}
          keyExtractor={(item) => item.song.id}
          renderItem={({ item }) => (
            <View
              style={[
                tw`flex-row items-center px-4 py-3`,
                { borderBottomWidth: 1, borderBottomColor: theme.border },
              ]}
            >
              <TouchableOpacity
                onPress={() => handlePlay(item.song)}
                style={tw`flex-1 flex-row items-center`}
              >
                <Image
                  source={{ uri: getBestImage(item.song.image) }}
                  style={tw`w-12 h-12 rounded-md mr-3 bg-gray-300`}
                />
                <View style={tw`flex-1`}>
                  <Text
                    style={[tw`text-base font-medium`, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {getSongDisplayName(item.song)}
                  </Text>
                  <Text
                    style={[tw`text-sm`, { color: theme.subText }]}
                    numberOfLines={1}
                  >
                    {getPrimaryArtists(item.song)}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePlay(item.song)}
                style={tw`mr-2`}
              >
                <Ionicons name="play" size={24} color={theme.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeDownload(item.song.id)}>
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={theme.subText}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
