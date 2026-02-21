import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { getBestImage } from "../utils/getImage";
import { decodeHtmlEntities } from "../utils/decodeHtmlEntities";

export default function ArtistsSection({ artists }: { artists: any[] }) {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  if (!artists.length) return null;

  return (
    <View style={tw`mt-6`}>
      {/* Header */}
      <View style={tw`px-4 mb-3 flex-row justify-between items-center`}>
        <Text style={[tw`text-lg font-semibold`, { color: theme.text }]}>
          Artists
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ArtistsList", { artists })}
        >
          <Text style={[tw`text-sm`, { color: theme.primary }]}>See All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={artists.slice(0, 10)}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tw`pl-4`}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ArtistDetail", { artist: item })
            }
            style={tw`mr-4 items-center`}
          >
            <Image
              source={{ uri: getBestImage(item.image) }}
              style={tw`w-20 h-20 rounded-full bg-gray-400`}
            />
            <Text
              numberOfLines={1}
              style={[tw`mt-2 text-sm`, { color: theme.text, width: 80 }]}
            >
              {decodeHtmlEntities(item.name)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
