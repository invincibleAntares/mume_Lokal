import React from "react";
import { FlatList, ActivityIndicator, View } from "react-native";
import SongRow from "../../components/SongRow";

interface SongsTabProps {
  songs: any[];
  loading: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function SongsTab({
  songs,
  loading,
  loadingMore = false,
  hasMore = true,
  onLoadMore,
}: SongsTabProps) {
  if (loading && songs.length === 0) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  const handleEndReached = () => {
    if (hasMore && !loadingMore && onLoadMore) onLoadMore();
  };

  const renderFooter = () =>
    loadingMore ? (
      <View style={{ paddingVertical: 16, alignItems: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    ) : null;

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SongRow song={item} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.4}
      ListFooterComponent={renderFooter}
    />
  );
}
