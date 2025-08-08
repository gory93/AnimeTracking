import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthData, User, MediaListEntry } from '../types';

const httpLink = createHttpLink({
  uri: 'https://graphql.anilist.co',
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('access_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export const CLIENT_ID = '29214';
export const REDIRECT_URI = 'myanilistapp://auth';

export const getAuthUrl = () => {
  // Back to Authorization Code flow since AniList doesn't support Implicit Grant
  // Add a random state parameter to force fresh authentication
  const state = Math.random().toString(36).substring(7);
  return `https://anilist.co/api/v2/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${state}`;
};

export const exchangeCodeForToken = async (code: string): Promise<AuthData> => {
  console.log('Exchanging code for token via proxy with code:', code.substring(0, 20) + '...');

  // Use proxy server - localhost for development, Vercel for production
  const proxyUrl = __DEV__ 
    ? 'http://localhost:3001/api/token'  // Development
    : 'https://your-project-name.vercel.app/api/token';  // Production (replace with your Vercel URL)
  
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      code: code,
    }),
  });

  console.log('Token exchange response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Token exchange failed:', errorText);
    throw new Error(`Failed to exchange code for token: ${response.status} - ${errorText}`);
  }

  const tokenData = await response.json();
  console.log('Token exchange successful via proxy');
  return tokenData;
};

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    Viewer {
      id
      name
      avatar {
        large
        medium
      }
    }
  }
`;

export const GET_USER_ANIME_LIST = gql`
  query GetUserAnimeList($userId: Int) {
    MediaListCollection(userId: $userId, type: ANIME) {
      lists {
        name
        isCustomList
        isCompletedList: isSplitCompletedList
        entries {
          id
          status
          score
          progress
          progressVolumes
          repeat
          priority
          private
          notes
          hiddenFromStatusLists
          customLists
          advancedScores
          startedAt {
            year
            month
            day
          }
          completedAt {
            year
            month
            day
          }
          updatedAt
          createdAt
          media {
            id
            title {
              romaji
              english
              native
            }
            coverImage {
              large
              medium
              color
            }
            episodes
            status
            season
            seasonYear
            genres
            averageScore
          }
        }
      }
    }
  }
`;

export const getCurrentUser = async (): Promise<User> => {
  const result = await apolloClient.query({
    query: GET_CURRENT_USER,
    fetchPolicy: 'network-only',
  });
  return result.data.Viewer;
};

export const getUserAnimeList = async (userId: number): Promise<MediaListEntry[]> => {
  const result = await apolloClient.query({
    query: GET_USER_ANIME_LIST,
    variables: { userId },
    fetchPolicy: 'network-only',
  });
  
  // Flatten all entries from all lists
  const allEntries: MediaListEntry[] = [];
  result.data.MediaListCollection.lists.forEach((list: any) => {
    allEntries.push(...list.entries);
  });
  
  return allEntries;
};
