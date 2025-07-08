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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setInitialRoute('sign-in');
      } else {
        const hasOnboarded = await AsyncStorage.getItem(
          'hasCompletedOnboarding'
        );
        setInitialRoute(hasOnboarded === 'true' ? '(tabs)' : 'onboarding');
      }
      setAuthChecked(true);
      await SplashScreen.hideAsync();
    });
    return unsubscribe;
  }, []);

  if (!fontsLoaded || !authChecked || !initialRoute) return null; // show splash until ready

  return (
    <>
      <Stack
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" backgroundColor="#0A0A0A" />
    </>
  );
}
