// import { useEffect, useState } from 'react';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFrameworkReady } from '@/hooks/useFrameworkReady';
// import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';
// import {
//   Inter_300Light,
//   Inter_400Regular,
//   Inter_500Medium,
//   Inter_600SemiBold,
//   Inter_700Bold,
// } from '@expo-google-fonts/inter';
// import {
//   PlayfairDisplay_400Regular,
//   PlayfairDisplay_700Bold,
// } from '@expo-google-fonts/playfair-display';

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   useFrameworkReady();

//   const [fontsLoaded, fontError] = useFonts({
//     'Inter-Light': Inter_300Light,
//     'Inter-Regular': Inter_400Regular,
//     'Inter-Medium': Inter_500Medium,
//     'Inter-SemiBold': Inter_600SemiBold,
//     'Inter-Bold': Inter_700Bold,
//     'Playfair-Regular': PlayfairDisplay_400Regular,
//     'Playfair-Bold': PlayfairDisplay_700Bold,
//   });

//   const [initialRoute, setInitialRoute] = useState<string | null>(null);

//   useEffect(() => {
//     const prepareApp = async () => {
//       await AsyncStorage.removeItem('hasCompletedOnboarding');
//       console.log('Cleared onboarding flag');
//       setInitialRoute('onboarding');
//     };
//     prepareApp();
//   }, []);

//   useEffect(() => {
//     if ((fontsLoaded || fontError) && initialRoute) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, fontError, initialRoute]);

//   if (!fontsLoaded || !initialRoute) {
//     return null; // show splash until ready
//   }

//   return (
//     <>
//       <Stack
//         screenOptions={{ headerShown: false }}
//         // initialRouteName={initialRoute}
//         initialRouteName="onboarding"
//       >
//         <Stack.Screen name="onboarding" />
//         <Stack.Screen name="persona-storyboard" />
//         <Stack.Screen name="(tabs)" />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="light" backgroundColor="#0A0A0A" />
//     </>
//   );
// }

// app/_layout.tsx
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { auth } from '../hooks/firebaseConfig';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_400Regular: require('@expo-google-fonts/inter/Inter_400Regular.ttf'),
    PlayfairDisplay_400Regular: require('@expo-google-fonts/playfair-display/PlayfairDisplay_400Regular.ttf'),
  });

  const saveUserToGlobalList = async (userData: any) => {
    try {
      // Get existing users
      const allUsersRaw = await AsyncStorage.getItem('allUsers');
      const allUsers = allUsersRaw ? JSON.parse(allUsersRaw) : [];

      // Check if user already exists
      const existingUserIndex = allUsers.findIndex(
        (u: any) => u.userId === userData.userId
      );

      if (existingUserIndex !== -1) {
        // Update existing user
        allUsers[existingUserIndex] = {
          ...allUsers[existingUserIndex],
          lastSignIn: new Date().toISOString(),
          email: userData.email,
          displayName: userData.displayName,
        };
      } else {
        // Add new user
        allUsers.push({
          userId: userData.userId,
          email: userData.email,
          displayName: userData.displayName,
          lastSignIn: new Date().toISOString(),
          platforms: {},
        });
      }

      // Save updated user list
      await AsyncStorage.setItem('allUsers', JSON.stringify(allUsers));
      console.log('✅ User data saved to global list');
    } catch (error) {
      console.error('❌ Error saving user to global list:', error);
    }
  };

  const handleAuthStateChange = async (user: any) => {
    console.log('🔄 Root layout: Auth state changed', {
      user: user ? user.email : 'null',
      uid: user?.uid,
    });

    if (!user) {
      console.log('🔄 Root layout: No user, setting route to sign-in');
      setInitialRoute('sign-in');
    } else {
      console.log(
        '🔄 Root layout: User authenticated, checking onboarding status'
      );

      // Save user to global list for dashboard tracking
      await saveUserToGlobalList({
        userId: user.uid,
        email: user.email,
        displayName: user.displayName,
      });

      const hasOnboarded = await AsyncStorage.getItem('hasCompletedOnboarding');
      console.log('🔄 Root layout: Onboarding status:', hasOnboarded);

      const route = hasOnboarded === 'true' ? '(tabs)' : 'onboarding';
      console.log('🔄 Root layout: Setting route to:', route);
      setInitialRoute(route);
    }
    setAuthChecked(true);
    await SplashScreen.hideAsync();
  };

  useEffect(() => {
    console.log('🔄 Root layout: Setting up auth state listener');

    // Check if user is already signed in
    const currentUser = auth.currentUser;
    if (currentUser) {
      console.log('🔄 Root layout: User already signed in:', currentUser.email);
      handleAuthStateChange(currentUser);
    }

    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    return unsubscribe;
  }, []);

  console.log('🔄 Root layout: Render state', {
    fontsLoaded,
    authChecked,
    initialRoute,
  });

  if (!fontsLoaded || !authChecked || !initialRoute) {
    console.log('🔄 Root layout: Showing splash screen');
    return null; // show splash until ready
  }

  console.log('🔄 Root layout: Rendering app with route:', initialRoute);

  return (
    <>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="persona-storyboard" />
        <Stack.Screen name="persona" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#0A0A0A" />
    </>
  );
}
