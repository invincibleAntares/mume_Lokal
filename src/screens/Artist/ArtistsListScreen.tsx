import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";
import { getBestImage } from "../../utils/getImage";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function ArtistsListScreen({ route, navigation }: any) {
  const { artists } = route.params;
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArtists = artists.filter((artist: any) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={tw`px-4 py-3 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[tw`text-lg font-semibold`, { color: theme.text }]}>
          All Artists
        </Text>
      </View>

      {/* Search Bar */}
      <View style={tw`px-4 py-2`}>
        <View
          style={[
            tw`flex-row items-center px-3 py-2 rounded-lg`,
            { backgroundColor: theme.card },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={theme.subText}
            style={tw`mr-2`}
          />
          <TextInput
            placeholder="Search artists..."
            placeholderTextColor={theme.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[tw`flex-1 text-base`, { color: theme.text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.subText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Artists List */}
      <FlatList
        data={filteredArtists}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`px-4`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ArtistDetail", { artist: item })
            }
            style={[
              tw`flex-row items-center py-3`,
              { borderBottomWidth: 1, borderBottomColor: theme.border },
            ]}
          >
            <Image
              source={{ uri: getBestImage(item.image) }}
              style={tw`w-14 h-14 rounded-full bg-gray-400 mr-3`}
            />
            <View style={tw`flex-1`}>
              <Text
                numberOfLines={1}
                style={[tw`text-base font-medium`, { color: theme.text }]}
              >
                {item.name}
              </Text>
              {(item.albumCount || item.songCount) && (
                <Text
                  numberOfLines={1}
                  style={[tw`text-xs mt-1`, { color: theme.subText }]}
                >
                  {item.albumCount
                    ? `${item.albumCount} Album${
                        item.albumCount > 1 ? "s" : ""
                      }`
                    : ""}
                  {item.albumCount && item.songCount ? " | " : ""}
                  {item.songCount ? `${item.songCount} Songs` : ""}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
