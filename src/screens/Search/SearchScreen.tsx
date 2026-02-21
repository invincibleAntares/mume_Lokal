import React, { useState, useEffect, useCallback } from "react";
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

const PAGE_SIZE = 20;

export default function SearchScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setTotal(0);
      setPage(0);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    setLoading(true);
    setPage(0);
    const delaySearch = setTimeout(async () => {
      try {
        const { results: searchResults, total: totalCount } = await searchSongs(
          searchQuery,
          0,
          PAGE_SIZE
        );
        setResults(searchResults);
        setTotal(totalCount);
        setPage(0);
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

  const loadMore = useCallback(async () => {
    if (loadingMore || results.length >= total || searchQuery.trim().length < 2)
      return;
    const queryAtStart = searchQuery;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { results: nextResults, total: totalCount } = await searchSongs(
        queryAtStart,
        nextPage,
        PAGE_SIZE
      );
      // Ignore if user changed search before this request finished
      if (queryAtStart !== searchQuery) return;
      setResults((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newItems = nextResults.filter((r) => !existingIds.has(r.id));
        const combined = [...prev, ...newItems];
        if (combined.length > 0) {
          useSongStore.setState({ songs: combined });
        }
        return combined;
      });
      setTotal(totalCount);
      setPage(nextPage);
    } catch (error) {
      console.error("Search load more failed:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [searchQuery, page, results, total, loadingMore]);

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
      {loading && results.length === 0 ? (
        <ActivityIndicator style={tw`mt-10`} size="large" />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <SongRow song={item} />}
          onEndReached={() => loadMore()}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            loadingMore ? (
              <View style={tw`py-4 items-center`}>
                <ActivityIndicator size="small" />
              </View>
            ) : null
          }
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
