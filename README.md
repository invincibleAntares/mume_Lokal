# Mume - Music Streaming App

A React Native music streaming app built with Expo. It uses the Saavn API for streaming and provides a simple UI with playback, search, artists, queue, offline downloads, and theme support.

## Features

- 🎵 **Music Playback** – Play, pause, seek, next/previous. Only one song plays at a time; resume continues from where you paused.
- 🔍 **Search** – Search songs and artists with debounced input and pagination (load more on scroll).
- 👤 **Artist Pages** – View artist profile with songs and albums; shuffle or play in order from the artist screen.
- 📋 **Queue** – Add songs to queue, remove and reorder; queue is persisted and played before the current list.
- 🎯 **Mini Player** – Floating bar above bottom tabs; tap to open full player. Hidden when the full Player screen is open.
- 💾 **Persistence** – Recently played (last 10) and queue saved locally and restored on app start.
- 📱 **Now Playing Notification** – One notification showing “Now playing” and song/artist; cleared when paused.
- 📥 **Offline** – Download songs for offline playback; manage downloads from Settings → Offline songs.
- 🎨 **Themes** – Light, Dark, and System; selection is persisted.

## Tech Stack

### Core

- **React Native 0.81.5** – Mobile framework
- **Expo ~54** – Development and build platform
- **TypeScript 5.9** – Type safety

### UI & Navigation

- **React Navigation** – Native stack and bottom tabs
- **twrnc** – Tailwind-style styling for React Native
- **@expo/vector-icons** – Icons (Ionicons)
- **react-native-safe-area-context** – Safe area handling

### State & Storage

- **Zustand** – Global state (songs, player, queue, recently played)
- **AsyncStorage** – Persist queue, recently played, last song
- **expo-file-system** – Store downloaded audio for offline

### Audio & Notifications

- **expo-av** – Audio playback (single instance, no overlapping)
- **expo-notifications** – Local “Now playing” notification

### Backend

- **Saavn API** (`https://saavn.sumit.co/api`) – Search, song/artist data, streaming URLs

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm
- Expo CLI
- For running on device: Android Studio/SDK (Android) or Xcode (iOS, macOS only)

### Installation

1. Clone the repository and go to the project folder:

   ```bash
   git clone <repository-url>
   cd mumeLokal
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npx run start
   ```


## Architecture

### Project Structure

```
mumeLokal/
├── index.ts
├── App.tsx
├── src/
│   ├── api/
│   │   └── saavn.ts
│   ├── audio/
│   │   └── audioService.ts
│   ├── notification/
│   │   └── nowPlayingNotification.ts
│   ├── storage/
│   │   └── playerStorage.ts
│   ├── store/
│   │   ├── songStore.ts
│   │   └── offlineStore.ts
│   ├── theme/
│   │   ├── colors.ts
│   │   └── ThemeContext.tsx
│   ├── utils/
│   │   ├── getAudioUrl.ts
│   │   ├── getImage.ts
│   │   ├── songHelpers.ts
│   │   └── decodeHtmlEntities.ts
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── BottomTabs.tsx
│   │   └── types.ts
│   ├── components/
│   │   ├── MiniPlayer.tsx
│   │   ├── SongRow.tsx
│   │   ├── Header.tsx
│   │   ├── Section.tsx
│   │   ├── Tabs.tsx
│   │   ├── BottomTabBar.tsx
│   │   ├── HorizontalList.tsx
│   │   ├── ArtistsSection.tsx
│   │   └── RecentlyPlayed.tsx
│   └── screens/
│       ├── Home/
│       ├── Player/
│       ├── Queue/
│       ├── Search/
│       ├── Artist/
│       ├── SeeAll/
│       ├── Settings/
│       ├── Favorites/
│       └── Playlists/
```

### Key Patterns

**1. State (Zustand)**  
`songStore` holds the current song list, current song, play state, position/duration, recently played, queue, and shuffle state for the artist screen. Actions like `setCurrentSong`, `togglePlay`, `playNext`/`playPrevious`, `seek`, and `hydratePlayer`/`hydrateRecentlyPlayed`/`hydrateQueue` run from the store. `offlineStore` holds downloaded songs and local paths for playback.

**2. Navigation**  
Bottom tabs: Home, Favorites, Playlists, Settings. Home is a stack with HomeMain, Player (modal), Queue, SongList, ArtistDetail, ArtistsList, Search. Settings stack has SettingsMain and OfflineSongs. A custom tab bar wraps the default one and shows the MiniPlayer above it (hidden on the Player screen).

**3. Audio**  
`audioService` wraps expo-av: `playSound` loads and plays a URL (calls are queued so only one song plays at a time), `pauseSound`/`resumeSoundIfCurrent` for pause/resume (resume keeps position), `seekTo` for seeking. Playback status is reported back so the store can update position and auto-advance on song end.

**4. Bootstrap**  
On app load, `App.tsx` runs notification setup (handler, Android channel, permission), then hydrates player state, recently played, queue, and offline list from AsyncStorage and file system.

**5. API**  
`saavn.ts` talks to the Saavn API: paginated song search, artist search, song by ID, song suggestions, artist by ID, artist songs and albums. Audio URLs are chosen via `getBestAudio` from the song’s `downloadUrl` list.

## Implemented Features

**Queue**  
Songs can be added from the song row menu. Queue is shown on the Queue screen; play order is queue first, then current list. Queue is saved to AsyncStorage and restored on startup.

**Search**  
Search screen has debounced input; results update the store’s song list. Pagination with “load more” at the end of the list so more results can be fetched.

**Theme**  
ThemeContext provides light, dark, and system. The chosen mode is stored and reapplied on next launch.

**Mini Player**  
A bar above the tabs shows the current song and play/pause. Tapping it opens the full Player screen. The bar is hidden when the user is already on the Player screen.

**Offline**  
From the song row menu, a song can be downloaded (expo-file-system). Offline list is under Settings → Offline songs; playback uses the local file when available.

**Now Playing Notification**  
When a song plays, a single local notification shows “Now playing” and the song/artist. It is dismissed when playback is paused.

## Styling

The app uses **twrnc** for layout and styling, with theme colors from ThemeContext (e.g. background, card, text). Common patterns: `tw\`flex-row items-center px-4\`` for rows, `tw\`text-lg font-bold\`` for text, and theme values for colors.

## Troubleshooting

- **Metro / cache issues:** Run `npx expo start -c`.
- **Build issues:** Try `npx expo prebuild --clean` then `npx expo run:android` or `npx expo run:ios`.
- **Audio not playing:** Check network and that the Saavn API is reachable. On device, allow notification permission if you want the “Now playing” notification.

## License

MIT.
