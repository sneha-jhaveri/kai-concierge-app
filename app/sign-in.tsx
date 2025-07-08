import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Text, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../hooks/firebaseConfig';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = () => {
  const router = useRouter();

  // Redirect if already signed in (e.g. web refresh)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('✅ Already signed in:', user.email);
        router.replace('/onboarding');
      }
    });
    return unsubscribe;
  }, []);

  // Redirect URI setup
  const isWeb = Platform.OS === 'web';
  const isLocalhost =
    isWeb &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1');
  const redirectUri = isWeb
    ? isLocalhost
      ? window.location.origin // e.g. http://localhost:8081
      : 'https://kai-concierge.netlify.app'
    : AuthSession.makeRedirectUri({
        native: 'com.kai.concierge:/oauthredirect',
        scheme: 'com.kai.concierge',
      });

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Kai Concierge</Text>
      <Button
        disabled={!request}
        title="Sign in with Google"
        onPress={() => promptAsync()}
      />
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0A0A0A',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
});
