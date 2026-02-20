import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";
import { useTheme } from "../../theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { searchSongs } from "../../api/saavn";
import SongRow from "../../components/SongRow";
import { useSongStore } from "../../store/songStore";

export default function SearchScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delaySearch = setTimeout(async () => {
      try {
        const searchResults = await searchSongs(searchQuery);
        setResults(searchResults);
        // Update store so songs can be played with next/prev functionality
        if (searchResults.length > 0) {
          useSongStore.setState({ songs: searchResults });
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={tw`px-4 py-3 flex-row items-center`}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-3`}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        {/* Search Input */}
        <View
          style={[
            tw`flex-1 flex-row items-center px-3 py-2 rounded-lg`,
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
            placeholder="Search songs, artists..."
            placeholderTextColor={theme.subText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            style={[tw`flex-1 text-base`, { color: theme.text }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.subText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator style={tw`mt-10`} size="large" />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SongRow song={item} />}
        />
      ) : searchQuery.length >= 2 ? (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Ionicons name="search-outline" size={64} color={theme.subText} />
          <Text
            style={[tw`text-lg mt-4 text-center`, { color: theme.subText }]}
          >
            No results found for "{searchQuery}"
          </Text>
        </View>
      ) : (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <Ionicons
            name="musical-notes-outline"
            size={64}
            color={theme.subText}
          />
          <Text
            style={[tw`text-lg mt-4 text-center`, { color: theme.subText }]}
          >
            Search for songs and artists
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
