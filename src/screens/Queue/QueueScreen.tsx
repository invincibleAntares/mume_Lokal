import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../theme/ThemeContext";
import { useSongStore } from "../../store/songStore";
import { getBestImage } from "../../utils/getImage";
import { getPrimaryArtists, getSongDisplayName } from "../../utils/songHelpers";

export default function QueueScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { queue, removeFromQueue, reorderQueue, clearQueue, setCurrentSong } = useSongStore();

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={tw`px-4 py-3`}>
        <View style={tw`flex-row items-center justify-between mb-2`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`mr-4`}
            >
              <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>
            <Text style={[tw`text-xl font-bold`, { color: theme.text }]}>
              Queue
            </Text>
          </View>

          {queue.length > 0 && (
            <TouchableOpacity onPress={clearQueue}>
              <Text style={[tw`text-sm font-medium`, { color: theme.primary }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[tw`text-sm ml-12`, { color: theme.subText }]}>
          {queue.length} {queue.length === 1 ? "song" : "songs"}
        </Text>
      </View>

      {/* Queue List */}
      {queue.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center px-8`}>
          <Ionicons name="list-outline" size={64} color={theme.subText} />
          <Text
            style={[
              tw`text-lg font-semibold mt-4 text-center`,
              { color: theme.text },
            ]}
          >
            No songs in queue
          </Text>
          <Text
            style={[tw`text-sm mt-2 text-center`, { color: theme.subText }]}
          >
            Add songs to your queue to play them next
          </Text>
        </View>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({ item, index }) => (
            <View
              style={[
                tw`flex-row items-center mx-4 mb-2 py-3 px-3 rounded-xl`,
                { backgroundColor: theme.card },
              ]}
            >
              {/* Position + Reorder group */}
              <View
                style={[
                  tw`items-center justify-center rounded-lg mr-3`,
                  { backgroundColor: theme.background, minWidth: 44 },
                ]}
              >
                <Text
                  style={[tw`text-xs font-semibold`, { color: theme.subText }]}
                >
                  {index + 1}
                </Text>
                <View style={tw`flex-row items-center mt-0.5`}>
                  <TouchableOpacity
                    onPress={() => reorderQueue(index, index - 1)}
                    disabled={index === 0}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={tw`p-0.5`}
                  >
                    <Ionicons
                      name="chevron-up"
                      size={18}
                      color={
                        index === 0 ? theme.subText + "40" : theme.primary
                      }
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => reorderQueue(index, index + 1)}
                    disabled={index === queue.length - 1}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={tw`p-0.5`}
                  >
                    <Ionicons
                      name="chevron-down"
                      size={18}
                      color={
                        index === queue.length - 1
                          ? theme.subText + "40"
                          : theme.primary
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => {
                  removeFromQueue(item.id);
                  setCurrentSong(item);
                  navigation.navigate("Player");
                }}
                style={tw`flex-1 flex-row items-center`}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: getBestImage(item.image) }}
                  style={tw`w-12 h-12 rounded-lg mr-3 bg-gray-700`}
                />
                <View style={tw`flex-1 mr-2 min-w-0`}>
                  <Text
                    numberOfLines={1}
                    style={[tw`text-sm font-semibold`, { color: theme.text }]}
                  >
                    {getSongDisplayName(item)}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={[tw`text-xs mt-0.5`, { color: theme.subText }]}
                  >
                    {getPrimaryArtists(item)}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => removeFromQueue(item.id)}
                style={[
                  tw`p-2 rounded-full`,
                  { backgroundColor: theme.background },
                ]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={theme.subText}
                />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={tw`px-0 pb-24 pt-1`}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
