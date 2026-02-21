import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";
import { Song, useSongStore } from "../store/songStore";
import { useOfflineStore } from "../store/offlineStore";
import { getBestImage } from "../utils/getImage";
import { getPrimaryArtists, getSongDisplayName } from "../utils/songHelpers";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "../navigation/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function SongRow({ song }: { song: Song }) {
  const { theme } = useTheme();
  const { setCurrentSong, currentSong, isPlaying, addToQueue, togglePlay } =
    useSongStore();
  const {
    isDownloaded,
    downloadingIds,
    errorById,
    downloadSong,
    removeDownload,
    clearError,
  } = useOfflineStore();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [showMenu, setShowMenu] = useState(false);

  const isCurrentSong = currentSong?.id === song.id;
  const isDownloading = downloadingIds.includes(song.id);
  const downloaded = isDownloaded(song.id);
  const error = errorById[song.id];

  const handleAddToQueue = () => {
    addToQueue(song);
    setShowMenu(false);
  };

  const handleDownloadOffline = () => {
    if (downloaded || isDownloading) return;
    clearError(song.id);
    downloadSong(song);
  };

  const handleRemoveDownload = () => {
    removeDownload(song.id);
    setShowMenu(false);
  };

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

      <TouchableOpacity
        style={tw`flex-1`}
        onPress={() => {
          setCurrentSong(song);
          navigation.navigate("Player");
        }}
        activeOpacity={0.8}
      >
        <Text
          style={[tw`text-base font-medium`, { color: theme.text }]}
          numberOfLines={1}
        >
          {getSongDisplayName(song)}
        </Text>
        <Text style={[tw`text-sm`, { color: theme.subText }]} numberOfLines={1}>
          {getPrimaryArtists(song)}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (isCurrentSong) {
            togglePlay();
          } else {
            setCurrentSong(song);
          }
          // Play button never opens full player; only pic/title do
        }}
        style={tw`mr-3`}
      >
        <Ionicons
          name={isCurrentSong && isPlaying ? "pause" : "play"}
          size={24}
          color={theme.primary}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setShowMenu(true)}>
        <Ionicons name="ellipsis-vertical" size={20} color={theme.subText} />
      </TouchableOpacity>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={tw`flex-1 bg-black bg-opacity-50`}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={tw`flex-1 justify-end`}>
            <View
              style={[tw`rounded-t-3xl p-4`, { backgroundColor: theme.card }]}
            >
              <View style={tw`flex-row items-center mb-4 px-2`}>
                <Image
                  source={{ uri: getBestImage(song.image) }}
                  style={tw`w-14 h-14 rounded mr-3`}
                />
                <View style={tw`flex-1`}>
                  <Text
                    style={[tw`text-base font-semibold`, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {getSongDisplayName(song)}
                  </Text>
                  <Text
                    style={[tw`text-sm mt-1`, { color: theme.subText }]}
                    numberOfLines={1}
                  >
                    {getPrimaryArtists(song)}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={handleAddToQueue}
                style={[
                  tw`flex-row items-center p-4 rounded-lg`,
                  { backgroundColor: theme.background },
                ]}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={theme.text}
                />
                <Text style={[tw`text-base ml-4`, { color: theme.text }]}>
                  Add to Queue
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDownloadOffline}
                disabled={downloaded || isDownloading}
                style={[
                  tw`flex-row items-center p-4 rounded-lg mt-2`,
                  { backgroundColor: theme.background },
                ]}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color={theme.text} />
                ) : (
                  <Ionicons
                    name={downloaded ? "checkmark-circle" : "cloud-download-outline"}
                    size={24}
                    color={downloaded ? theme.primary : theme.text}
                  />
                )}
                <Text
                  style={[
                    tw`text-base ml-4`,
                    {
                      color: error ? theme.primary : downloaded ? theme.primary : theme.text,
                    },
                  ]}
                >
                  {error || (downloaded ? "Downloaded" : isDownloading ? "Downloading..." : "Download offline")}
                </Text>
              </TouchableOpacity>

              {downloaded && (
                <TouchableOpacity
                  onPress={handleRemoveDownload}
                  style={[
                    tw`flex-row items-center p-4 rounded-lg mt-2`,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Ionicons
                    name="trash-outline"
                    size={24}
                    color={theme.subText}
                  />
                  <Text style={[tw`text-base ml-4`, { color: theme.subText }]}>
                    Remove download
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => setShowMenu(false)}
                style={tw`mt-4 p-4 items-center`}
              >
                <Text style={[tw`text-base`, { color: theme.subText }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
