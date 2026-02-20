import { View, Text, Image, TouchableOpacity } from "react-native";
import tw from "twrnc";
import { useTheme } from "../theme/ThemeContext";

interface Props {
  title: string;
  artist: string;
  image?: string;
  onPlay?: () => void;
}

export default function SongRow({ title, artist, image, onPlay }: Props) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        tw`flex-row items-center px-4 py-3`,
        { borderBottomWidth: 1, borderBottomColor: theme.border },
      ]}
    >
      {/* Artwork */}
      <Image
        source={{ uri: image }}
        style={tw`w-12 h-12 rounded-md mr-3 bg-gray-300`}
      />

      {/* Title + Artist */}
      <View style={tw`flex-1`}>
        <Text
          style={[tw`text-base font-medium`, { color: theme.text }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[tw`text-sm mt-0.5`, { color: theme.subText }]}
          numberOfLines={1}
        >
          {artist}
        </Text>
      </View>

      {/* Play button */}
      <TouchableOpacity onPress={onPlay}>
        <Text style={[tw`text-xl`, { color: theme.primary }]}>▶️</Text>
      </TouchableOpacity>
    </View>
  );
}
