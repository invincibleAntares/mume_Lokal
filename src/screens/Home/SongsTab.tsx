import React from "react";
import { FlatList, ActivityIndicator } from "react-native";
import SongRow from "../../components/SongRow";

interface SongsTabProps {
  songs: any[];
  loading: boolean;
}

export default function SongsTab({ songs, loading }: SongsTabProps) {
  if (loading) {
    return <ActivityIndicator style={{ marginTop: 20 }} />;
  }

  return (
    <FlatList
      data={songs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SongRow song={item} />}
    />
  );
}
