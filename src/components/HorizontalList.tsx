import { FlatList, Image, Text, View } from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";
import { decodeHtmlEntities } from "../utils/decodeHtmlEntities";

export default function HorizontalList({
  data,
  type,
}: {
  data: any[];
  type?: "artist";
}) {
  const { theme } = useTheme();

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={tw`pl-4`}
      renderItem={({ item }) => (
        <View style={tw`mr-4 w-28`}>
          <Image
            source={{ uri: item.image }}
            style={tw`${
              type === "artist" ? "rounded-full" : "rounded-lg"
            } w-28 h-28`}
          />
          {item.title && (
            <Text
              style={[tw`text-sm mt-2`, { color: theme.text }]}
              numberOfLines={2}
            >
              {decodeHtmlEntities(item.title)}
            </Text>
          )}
          {item.name && (
            <Text
              style={[tw`text-sm mt-2 text-center`, { color: theme.text }]}
              numberOfLines={1}
            >
              {decodeHtmlEntities(item.name)}
            </Text>
          )}
        </View>
      )}
    />
  );
}
