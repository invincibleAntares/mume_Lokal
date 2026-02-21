import { Artist, Song } from "../store/songStore";

export type HomeStackParamList = {
  HomeMain: undefined;

  Player: undefined;
  Queue: undefined;

  SongList: {
    title: string;
    songs: Song[];
  };
  ArtistDetail: {
    artist: Artist;
  };
  ArtistsList: {
    artists: Artist[];
  };
  Search: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  OfflineSongs: undefined;
};
