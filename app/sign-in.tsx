import React, { useEffect } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../hooks/firebaseConfig';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = () => {
  const router = useRouter();

  // Simplified redirect URI setup
  const isWeb = Platform.OS === 'web';
  const isLocalhost =
    isWeb &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');

  // Use root path for better OAuth compatibility
  const redirectUri = isWeb
    ? isLocalhost
      ? `${window.location.origin}/` // Local development
      : 'https://kai-concierge.netlify.app/' // Production
    : AuthSession.makeRedirectUri({
        native: 'com.kai.concierge:/oauthredirect',
        scheme: 'com.kai.concierge',
      });

  console.log('🔗 Redirect URI:', redirectUri);

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleClientId,
    webClientId: Constants.expoConfig?.extra?.googleClientId,
    androidClientId: Constants.expoConfig?.extra?.googleClientId,
    iosClientId: Constants.expoConfig?.extra?.googleClientId,
    redirectUri,
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
  });

  // Handle response
  useEffect(() => {
    const handleAuth = async () => {
      if (response?.type === 'success') {
        console.log('✅ Google OAuth response:', response);

        const idToken =
          response.params?.id_token || response.authentication?.idToken;
        if (!idToken) {
          alert('❌ No idToken received from Google');
          console.error('Missing idToken in response:', response);
          return;
        }

        const credential = GoogleAuthProvider.credential(idToken);
        console.log('✅ Firebase credential:', credential);

        try {
          const userCredential = await signInWithCredential(auth, credential);
          console.log('✅ Firebase user signed in:', userCredential.user);
          alert('✅ Signed in as: ' + userCredential.user.email);
          router.replace('/onboarding');
          console.log(
            '🔄 Sign-in: User signed in, waiting for root layout to redirect...'
          );
          // The root layout will handle the redirect based on auth state
        } catch (err) {
          console.error('❌ Firebase signInWithCredential error:', err);
          const errorMessage = err instanceof Error ? err.message : String(err);
          alert('Firebase error: ' + errorMessage);
        }
      } else if (response) {
        console.warn('⚠️ Google OAuth response not successful:', response);
        alert('Sign-in failed or cancelled.');
      }
    };

    handleAuth();
  }, [response]);

  const handleTestRedirect = () => {
    console.log('🔄 Sign-in: Manual redirect to onboarding');
    router.replace('/onboarding');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Kai Concierge</Text>
      <Button
        disabled={!request}
        title="Sign in with Google"
        onPress={() => promptAsync()}
      />

      {/* Test button for debugging */}
      {/* <TouchableOpacity style={styles.testButton} onPress={handleTestRedirect}>
        <Text style={styles.testButtonText}>Test: Go to Onboarding</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  testButton: {
    marginTop: 20,
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#0A0A0A',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
