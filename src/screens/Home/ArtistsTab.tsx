import React from "react";
import { FlatList, View, Text, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { getBestImage } from "../../utils/getImage";

interface ArtistsTabProps {
  artists: any[];
}

export default function ArtistsTab({ artists }: ArtistsTabProps) {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();

  return (
    <FlatList
      data={artists}
      keyExtractor={(item) => item.id}
      contentContainerStyle={tw`px-4 pt-4`}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => navigation.navigate("ArtistDetail", { artist: item })}
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
                  ? `${item.albumCount} Album${item.albumCount > 1 ? "s" : ""}`
                  : ""}
                {item.albumCount && item.songCount ? " | " : ""}
                {item.songCount ? `${item.songCount} Songs` : ""}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
