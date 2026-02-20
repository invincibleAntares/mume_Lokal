import React from "react";
import { FlatList } from "react-native";
import RecentlyPlayed from "../../components/RecentlyPlayed";
import ArtistsSection from "../../components/ArtistsSection";
import SuggestedSongs from "./SuggestedSongs";

interface SuggestedTabProps {
  artists: any[];
  songs: any[];
  loading: boolean;
}

export default function SuggestedTab({
  artists,
  songs,
  loading,
}: SuggestedTabProps) {
  return (
    <FlatList
      data={[1]} // dummy
      renderItem={() => (
        <>
          <RecentlyPlayed />
          <ArtistsSection artists={artists} />
          <SuggestedSongs songs={songs} loading={loading} />
        </>
      )}
    />
  );
}
