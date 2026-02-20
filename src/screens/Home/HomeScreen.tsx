import React, { useState } from "react";
import { FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

import Header from "../../components/Header";
import Tabs from "../../components/Tabs";
import Section from "../../components/Section";
import HorizontalList from "../../components/HorizontalList";
import { useTheme } from "../../theme/ThemeContext";
import { useEffect } from "react";
import { useSongStore } from "../../store/songStore";
import SongRow from "../../components/SongRow";
import { getBestImage } from "../../utils/getImage";

const TABS = ["Suggested", "Songs", "Artists"];

const RECENTLY_PLAYED = [
  { id: "1", title: "Shades of Love", image: "https://picsum.photos/200?1" },
  { id: "2", title: "Without You", image: "https://picsum.photos/200?2" },
  { id: "3", title: "Save Your Tears", image: "https://picsum.photos/200?3" },
];

const ARTISTS = [
  { id: "1", name: "Ariana Grande", image: "https://picsum.photos/200?4" },
  { id: "2", name: "The Weeknd", image: "https://picsum.photos/200?5" },
  { id: "3", name: "Acidrap", image: "https://picsum.photos/200?6" },
];

const MOST_PLAYED = [
  { id: "1", image: "https://picsum.photos/200?7" },
  { id: "2", image: "https://picsum.photos/200?8" },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Suggested");
  const { songs, loading, fetchSongs } = useSongStore();
  const { theme } = useTheme();

  useEffect(() => {
    if (activeTab === "Songs" && songs.length === 0) {
      fetchSongs("arijit");
    }
  }, [activeTab]);

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: theme.background }]}>
      <Header />
      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "Songs" &&
        (loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={songs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SongRow song={item} />}
          />
        ))}
    </SafeAreaView>
  );
}
