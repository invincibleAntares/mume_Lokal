import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import Header from "../../components/Header";
import Tabs from "../../components/Tabs";
import { useTheme } from "../../theme/ThemeContext";
import { useSongStore } from "../../store/songStore";
import SuggestedTab from "./SuggestedTab";
import SongsTab from "./SongsTab";
import ArtistsTab from "./ArtistsTab";

const TABS = ["Suggested", "Songs", "Artists"];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Suggested");
  const { songs, loading, fetchSongs } = useSongStore();
  const { theme } = useTheme();

  useEffect(() => {
    if (activeTab === "Suggested" && songs.length === 0) {
      fetchSongs("trending");
    }
    if (activeTab === "Songs" && songs.length === 0) {
      fetchSongs("arijit");
    }
  }, [activeTab]);

  const artists = React.useMemo(() => {
    const map = new Map<string, any>();

    songs.forEach((song) => {
      const primaryArtists = song.artists?.primary || [];
      primaryArtists.forEach((artist) => {
        if (!map.has(artist.id)) {
          map.set(artist.id, {
            id: artist.id,
            name: artist.name,
            image: artist.image || song.image,
          });
        }
      });
    });

    return Array.from(map.values());
  }, [songs]);

  return (
    <SafeAreaView
      style={[tw`flex-1 pb-0 mb-0`, { backgroundColor: theme.background }]}
    >
      <Header />
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "Suggested" && (
        <SuggestedTab artists={artists} songs={songs} loading={loading} />
      )}

      {activeTab === "Songs" && <SongsTab songs={songs} loading={loading} />}

      {activeTab === "Artists" && <ArtistsTab artists={artists} />}
    </SafeAreaView>
  );
}
