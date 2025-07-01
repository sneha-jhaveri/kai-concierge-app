// import { useEffect } from 'react';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
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

//   useEffect(() => {
//     if (fontsLoaded || fontError) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, fontError]);

//   if (!fontsLoaded && !fontError) {
//     return null;
//   }

//   return (
//     <>
//       <Stack screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="onboarding" />
//         <Stack.Screen name="(tabs)" />
//         <Stack.Screen name="+not-found" />
//       </Stack>
//       <StatusBar style="light" backgroundColor="#0A0A0A" />
//     </>
//   );
// }

import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Light': Inter_300Light,
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Playfair-Regular': PlayfairDisplay_400Regular,
    'Playfair-Bold': PlayfairDisplay_700Bold,
  });
  const [initialRoute, setInitialRoute] = useState<
    '/onboarding' | '/(tabs)' | null
  >(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          'hasCompletedOnboarding'
        );
        setInitialRoute(
          hasCompletedOnboarding === 'true' ? '/(tabs)' : '/onboarding'
        );
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setInitialRoute('/onboarding'); // Default to onboarding on error
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && initialRoute) {
      SplashScreen.hideAsync();
      router.replace(initialRoute);
    }
  }, [fontsLoaded, fontError, initialRoute]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#0A0A0A" />
    </>
  );
}
