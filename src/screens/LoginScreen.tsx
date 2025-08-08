import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Modal,
  Dimensions,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useAuth } from '../context/AuthContext';
import { getAuthUrl } from '../services/anilistApi';
import 'react-native-url-polyfill/auto';

const { width, height } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [showWebView, setShowWebView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
      if (url.startsWith('myanilistapp://auth')) {
        handleAuthCallback(url);
      }
    };

    // Handle app launch from URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for incoming URLs while app is running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  const handleAuthCallback = async (url: string) => {
    console.log('Processing auth callback:', url);
    try {
      const urlObj = new URL(url);
      const code = urlObj.searchParams.get('code');
      
      if (code) {
        console.log('Found authorization code:', code.substring(0, 20) + '...');
        setIsLoading(true);
        setShowWebView(false);
        await login(code);
      } else {
        const error = urlObj.searchParams.get('error');
        console.log('Auth error:', error);
        Alert.alert('Authentication Error', error || 'Unknown error occurred');
        setShowWebView(false);
      }
    } catch (error) {
      console.error('Error handling auth callback:', error);
      Alert.alert('Error', 'Failed to complete authentication');
      setShowWebView(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setShowWebView(true);
  };

  const handleWebViewNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log('WebView navigation to:', url);
    
    // Custom URL scheme will be handled by deep linking
    if (url.startsWith('myanilistapp://auth')) {
      console.log('Custom URL detected, will be handled by deep linking');
    }
  };

  const handleShouldStartLoad = (request: any) => {
    const { url } = request;
    console.log('onShouldStartLoadWithRequest called with URL:', url);
    
    // Allow the custom URL scheme to be handled by the system (deep linking)
    if (url.startsWith('myanilistapp://auth')) {
      console.log('Allowing custom URL to be handled by system deep linking');
      return true; // Let the system handle it
    }
    
    return true; // Allow normal navigation
  };

  const closeWebView = () => {
    setShowWebView(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>AniList Tracker</Text>
          <Text style={styles.subtitle}>Track your anime journey</Text>
        </View>

        <View style={styles.loginContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Authenticating...' : 'Login with AniList'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.infoText}>
            You'll be redirected to AniList to authorize this app
          </Text>
        </View>
      </View>

      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeWebView}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.webViewTitle}>AniList Login</Text>
            <View style={styles.placeholder} />
          </View>
          
          <WebView
            source={{ uri: getAuthUrl() }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            style={styles.webView}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
            mixedContentMode="compatibility"
            cacheEnabled={false}
            incognito={true}
            sharedCookiesEnabled={false}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1426',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#8BA0B2',
    textAlign: 'center',
  },
  loginContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#3DB4F2',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  infoText: {
    color: '#8BA0B2',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  closeButtonText: {
    color: '#3DB4F2',
    fontSize: 16,
    fontWeight: '600',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  placeholder: {
    width: 60,
  },
  webView: {
    flex: 1,
  },
});

export default LoginScreen;
