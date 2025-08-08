import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { ApolloProvider } from '@apollo/client';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { apolloClient } from './src/services/anilistApi';
import 'react-native-gesture-handler';

const App: React.FC = () => {
  useEffect(() => {
    // Configure status bar
    StatusBar.setBarStyle('light-content', true);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="#0B1426"
            translucent={false}
          />
          <AppNavigator />
        </AuthProvider>
      </ApolloProvider>
    </GestureHandlerRootView>
  );
};

export default App;
