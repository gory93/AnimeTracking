import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { getUserAnimeList } from '../services/anilistApi';
import { MediaListEntry } from '../types';

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [animeList, setAnimeList] = useState<MediaListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnimeList();
  }, []);

  const loadAnimeList = async () => {
    try {
      if (user) {
        const list = await getUserAnimeList(user.id);
        // Filter out any items with missing required data
        const validList = list.filter(item => 
          item && 
          item.media && 
          item.media.title && 
          (item.media.title.english || item.media.title.romaji)
        );
        setAnimeList(validList);
      }
    } catch (error) {
      console.error('Error loading anime list:', error);
      Alert.alert('Error', 'Failed to load anime list');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnimeList();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CURRENT':
        return '#68D391';
      case 'COMPLETED':
        return '#3DB4F2';
      case 'PAUSED':
        return '#F6AD55';
      case 'DROPPED':
        return '#FC8181';
      case 'PLANNING':
        return '#A78BFA';
      case 'UNKNOWN':
        return '#8BA0B2';
      default:
        return '#8BA0B2';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'CURRENT':
        return 'Watching';
      case 'COMPLETED':
        return 'Completed';
      case 'PAUSED':
        return 'Paused';
      case 'DROPPED':
        return 'Dropped';
      case 'PLANNING':
        return 'Planning';
      case 'UNKNOWN':
        return 'Unknown';
      default:
        return status || 'Unknown';
    }
  };

  const renderAnimeItem = ({ item }: { item: MediaListEntry }) => (
    <View style={styles.animeItem}>
      <Image
        source={{ uri: item.media.coverImage.medium || item.media.coverImage.large }}
        style={styles.animeCover}
        resizeMode="cover"
      />
      <View style={styles.animeInfo}>
        <Text style={styles.animeTitle} numberOfLines={2}>
          {String(item.media.title?.english || item.media.title?.romaji || 'Unknown Title')}
        </Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{String(formatStatus(item.status || 'UNKNOWN'))}</Text>
          </View>
        </View>
        <Text style={styles.progressText}>
          Progress: {String(item.progress || 0)}/{String(item.media.episodes || '?')}
        </Text>
        {item.score && item.score > 0 && (
          <Text style={styles.scoreText}>Score: {String(item.score)}/10</Text>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3DB4F2" />
        <Text style={styles.loadingText}>Loading your anime list...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {String(user?.name || 'User')}!</Text>
          <Text style={styles.subtitle}>Your Anime Collection</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {animeList.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No anime in your list yet!</Text>
          <Text style={styles.emptySubtext}>
            Start adding anime to your AniList to see them here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={animeList}
          renderItem={renderAnimeItem}
          keyExtractor={(item) => (item.id || Math.random()).toString()}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3DB4F2"
              colors={['#3DB4F2']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1426',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0B1426',
  },
  loadingText: {
    color: '#8BA0B2',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#8BA0B2',
    marginTop: 4,
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1F2937',
    borderRadius: 6,
  },
  logoutText: {
    color: '#8BA0B2',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  animeItem: {
    flexDirection: 'row',
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  animeCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  animeInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-start',
  },
  animeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    color: '#8BA0B2',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 14,
    color: '#F6AD55',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#8BA0B2',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;
