# Anime Tracking App

A React Native app for tracking your anime shows using the AniList API.

## Features

- **AniList OAuth Authentication**: Secure login through AniList's OAuth system
- **Anime List Display**: View all your tracked anime shows from AniList
- **Cross-platform**: Works on both Android and iOS
- **Modern UI**: Clean, dark-themed interface

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd AnimeTracking
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **iOS Setup:**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Run the app:**

   For Android:
   ```bash
   npm run android
   ```

   For iOS:
   ```bash
   npm run ios
   ```

## Configuration

The app is pre-configured with:
- **Client ID**: 29214
- **Redirect URI**: `myanilistapp://auth`

These are set up in `src/services/anilistApi.ts`.

## Deep Linking Setup

The app is configured to handle the redirect URI `myanilistapp://auth` for OAuth authentication:

### Android
Deep linking is configured in `android/app/src/main/AndroidManifest.xml` with an intent filter for the custom scheme.

### iOS
URL scheme is configured in `ios/AnimeTracking/Info.plist` under `CFBundleURLTypes`.

## App Flow

1. **Login Screen**: User taps "Login with AniList"
2. **WebView Authentication**: Opens AniList OAuth page in a modal WebView
3. **Authorization**: User authorizes the app on AniList
4. **Automatic Redirect**: App automatically closes WebView and stores token
5. **Home Screen**: Displays user's tracked anime list with:
   - Anime cover images
   - Title (English or Romaji)
   - Status badges (Watching, Completed, etc.)
   - Progress tracking
   - User scores

## API Integration

The app uses AniList's GraphQL API:
- Authentication via OAuth 2.0
- Fetches user profile information
- Retrieves complete anime list with media details
- Supports pull-to-refresh functionality

## Dependencies

- **React Navigation**: Screen navigation
- **Apollo Client**: GraphQL API client
- **React Native WebView**: OAuth authentication
- **AsyncStorage**: Token storage
- **React Native Gesture Handler**: Navigation gestures

## File Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Authentication state management
├── navigation/
│   └── AppNavigator.tsx         # Navigation configuration
├── screens/
│   ├── LoginScreen.tsx          # Login with WebView authentication
│   └── HomeScreen.tsx           # Anime list display
├── services/
│   └── anilistApi.ts           # AniList API client and queries
└── types/
    └── index.ts                # TypeScript type definitions
```

## Troubleshooting

- **Deep linking not working**: Ensure the custom URL scheme is properly configured in platform-specific files
- **API errors**: Check network connection and verify AniList API status
- **Build issues**: Clear cache with `npx react-native start --reset-cache`

## Development

To add new features or modify the app:

1. **Authentication logic**: Modify `src/context/AuthContext.tsx`
2. **API queries**: Update `src/services/anilistApi.ts`
3. **UI components**: Edit screen files in `src/screens/`
4. **Navigation**: Configure routes in `src/navigation/AppNavigator.tsx`
