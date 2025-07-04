// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Image,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter } from 'expo-router';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   withSpring,
//   withRepeat,
//   withSequence,
// } from 'react-native-reanimated';
// import {
//   Sparkles,
//   Crown,
//   Star,
//   ArrowRight,
//   Bot,
//   User,
//   Heart,
//   ShoppingBag,
//   Target,
//   CheckCircle,
// } from 'lucide-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const { width, height } = Dimensions.get('window');

// export default function PersonaStoryboardScreen() {
//   const router = useRouter();
//   interface Slide {
//     id: number;
//     title: string;
//     content: any;
//     image: string;
//     icon: any;
//   }

//   const [summary, setSummary] = useState<any>(null);
//   const [slides, setSlides] = useState<Slide[]>([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isComplete, setIsComplete] = useState(false);

//   const imageScale = useSharedValue(1);
//   const slideOpacity = useSharedValue(0);
//   const slideTranslateX = useSharedValue(50);
//   const progressWidth = useSharedValue(0);

//   useEffect(() => {
//     const fetchData = async () => {
//       const raw = await AsyncStorage.getItem('personaSummary');
//       if (raw) {
//         const parsed = JSON.parse(raw);
//         setSummary(parsed);
//         setSlides([
//           {
//             id: 1,
//             title: 'Your Demographics',
//             content: parsed.demographics,
//             image:
//               'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg',
//             icon: User,
//           },
//           {
//             id: 2,
//             title: 'Personality Profile',
//             content: parsed.personality,
//             image:
//               'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
//             icon: Heart,
//           },
//           {
//             id: 3,
//             title: 'Interests & Hobbies',
//             content: parsed.interests,
//             image:
//               'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
//             icon: Star,
//           },
//           {
//             id: 4,
//             title: 'Shopping Preferences',
//             content: parsed.shopping,
//             image:
//               'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
//             icon: ShoppingBag,
//           },
//           {
//             id: 5,
//             title: 'Recommendations',
//             content: parsed.recommendations,
//             image:
//               'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
//             icon: Target,
//           },
//         ]);
//       }
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     imageScale.value = withTiming(1.05, { duration: 5000 });
//     slideOpacity.value = withSpring(1);
//     slideTranslateX.value = withSpring(0);
//     progressWidth.value = withSpring((currentSlide + 1) / (slides.length || 1));
//   }, [currentSlide]);

//   const imageAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: imageScale.value }],
//   }));

//   const slideAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: slideOpacity.value,
//     transform: [{ translateX: slideTranslateX.value }],
//   }));

//   const progressAnimatedStyle = useAnimatedStyle(() => ({
//     width: `${progressWidth.value * 100}%`,
//   }));

//   if (!slides.length) return <Text style={{ color: '#fff' }}>Loading...</Text>;

//   const current = slides[currentSlide];

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#0A0A0A', '#1A1A1A']}
//         style={styles.background}
//       />
//       <SafeAreaView style={{ flex: 1 }}>
//         <View style={styles.progressBar}>
//           <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
//         </View>

//         <ScrollView>
//           <Animated.View style={[styles.slide, slideAnimatedStyle]}>
//             <Animated.Image
//               source={{ uri: current.image }}
//               style={[styles.image, imageAnimatedStyle]}
//             />
//             <BlurView intensity={20} tint="dark" style={styles.luxuryCard}>
//               <Text style={styles.title}>{current.title}</Text>
//               <Text style={styles.content}>{current.content}</Text>
//             </BlurView>
//           </Animated.View>
//         </ScrollView>

//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => {
//             if (currentSlide < slides.length - 1)
//               setCurrentSlide(currentSlide + 1);
//             else {
//               setIsComplete(true);
//               router.replace('/(tabs)/chat');
//             }
//           }}
//         >
//           <Text style={styles.buttonText}>
//             {currentSlide === slides.length - 1
//               ? 'Start Experience'
//               : 'Continue'}
//           </Text>
//           <ArrowRight size={20} color="#0A0A0A" />
//         </TouchableOpacity>
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#0A0A0A' },
//   background: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     margin: 16,
//     borderRadius: 2,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#FFD700',
//   },
//   slide: {
//     paddingHorizontal: 24,
//     paddingTop: 20,
//   },
//   image: {
//     width: '100%',
//     height: height * 0.35,
//     borderRadius: 20,
//     marginBottom: 24,
//   },
//   luxuryCard: {
//     padding: 24,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255, 215, 0, 0.3)',
//     backgroundColor: 'rgba(10,10,10,0.4)',
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 28,
//     fontFamily: 'Playfair-Bold',
//     color: '#FFFFFF',
//     marginBottom: 16,
//     letterSpacing: 0.5,
//     lineHeight: 36,
//   },
//   content: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#CCCCCC',
//     lineHeight: 24,
//   },
//   button: {
//     flexDirection: 'row',
//     backgroundColor: '#FFD700',
//     margin: 24,
//     borderRadius: 16,
//     paddingVertical: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#0A0A0A',
//     marginRight: 8,
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import {
  Sparkles,
  Crown,
  Star,
  ArrowRight,
  Bot,
  User,
  Heart,
  ShoppingBag,
  Target,
  CheckCircle,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function PersonaStoryboardScreen() {
  const router = useRouter();
  interface Slide {
    id: number;
    title: string;
    content: string;
    image: string;
    icon: any;
  }

  const [summary, setSummary] = useState<any>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const imageScale = useSharedValue(1);
  const slideOpacity = useSharedValue(0);
  const slideTranslateX = useSharedValue(50);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const raw = await AsyncStorage.getItem('personaSummary');
        console.log('Raw data from AsyncStorage:', raw); // Debug log
        if (!raw) {
          console.warn('No personaSummary found in AsyncStorage');
          setIsLoading(false);
          return;
        }

        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (jsonError) {
          console.error('Invalid JSON in personaSummary:', raw, jsonError);
          setIsLoading(false);
          return;
        }

        console.log('Parsed personaSummary:', parsed); // Debug log
        setSummary(parsed?.summary || null);

        const slidesData = parsed?.slides;
        if (!slidesData) {
          console.warn(
            'Slides data not found in AsyncStorage. Parsed:',
            parsed
          );
          setIsLoading(false);
          return;
        }

        const icons = [User, Heart, Star, ShoppingBag, Target];
        const slideOrder = [
          'digital_identity',
          'personality_type',
          'interests_habits',
          'shopping_persona',
          'brand_recommendations',
        ];

        const slidesArray = slideOrder
          .map((key, index) => {
            const slide = slidesData[key];
            if (!slide || !Array.isArray(slide.points)) return null;

            return {
              id: index + 1,
              title: slide.title || 'Untitled Slide',
              content: slide.points.join('\n\n'),
              image: `https://source.unsplash.com/random/800x600?sig=${index}`,
              icon: icons[index] || Sparkles,
            };
          })
          .filter((s): s is Slide => s !== null);

        setSlides(slidesArray);
      } catch (error) {
        console.error('Error fetching persona data:', error);
      } finally {
        setIsLoading(false); // End loading
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && slides.length > 0) {
      imageScale.value = withTiming(1.05, { duration: 5000 });
      slideOpacity.value = withSpring(1);
      slideTranslateX.value = withSpring(0);
      progressWidth.value = withSpring(
        (currentSlide + 1) / (slides.length || 1)
      );
    }
  }, [currentSlide, isLoading, slides.length]);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    opacity: slideOpacity.value,
    transform: [{ translateX: slideTranslateX.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A']}
          style={styles.background}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!slides.length) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A']}
          style={styles.background}
        />
        <Text style={styles.loadingText}>No data available</Text>
      </View>
    );
  }

  if (isComplete) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A']}
          style={styles.background}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.completeContainer}>
            <View style={styles.completeIconContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.completeIcon}
              >
                <CheckCircle size={48} color="#0A0A0A" />
              </LinearGradient>
            </View>
            <Text style={styles.completeTitle}>Profile Complete!</Text>
            <Text style={styles.completeSubtitle}>
              Kai is ready to assist you with personalized luxury services
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const current = slides[currentSlide];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A']}
        style={styles.background}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
        </View>

        <ScrollView>
          <Animated.View style={[styles.slide, slideAnimatedStyle]}>
            <Animated.Image
              source={{ uri: current.image }}
              style={[styles.image, imageAnimatedStyle]}
            />
            <BlurView intensity={20} tint="dark" style={styles.luxuryCard}>
              <Text style={styles.title}>{current.title}</Text>
              <Text style={styles.content}>{current.content}</Text>
            </BlurView>
          </Animated.View>
        </ScrollView>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (currentSlide < slides.length - 1) {
              setCurrentSlide(currentSlide + 1);
            } else {
              setIsComplete(true);
              setTimeout(() => {
                router.replace('/(tabs)/chat');
              }, 2000);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1
              ? 'Start Experience'
              : 'Continue'}
          </Text>
          <ArrowRight size={20} color="#0A0A0A" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginTop: 50,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    margin: 16,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  slide: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  image: {
    width: '100%',
    height: height * 0.35,
    borderRadius: 20,
    marginBottom: 24,
  },
  luxuryCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    backgroundColor: 'rgba(10,10,10,0.4)',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 0.5,
    lineHeight: 36,
  },
  content: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    margin: 24,
    borderRadius: 16,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0A0A0A',
    marginRight: 8,
  },
  completeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  completeIconContainer: {
    marginBottom: 32,
  },
  completeIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  completeTitle: {
    fontSize: 32,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  completeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
  },
});
