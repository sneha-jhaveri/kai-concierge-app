import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../hooks/firebaseConfig';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const SignInScreen = () => {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleClientId,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          // Optional: Save user info
          console.log('Signed in:', userCredential.user.displayName);
          router.replace('/onboarding');
        })
        .catch((err) => {
          console.error('Sign-in error:', err);
        });
    }
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
