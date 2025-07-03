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
//   withSpring,
//   withDelay,
//   withRepeat,
//   withSequence,
//   runOnJS,
// } from 'react-native-reanimated';
// import {
//   User,
//   Heart,
//   ShoppingBag,
//   Sparkles,
//   Crown,
//   Star,
//   TrendingUp,
//   Target,
//   ArrowRight,
//   Bot,
//   CircleCheck as CheckCircle,
// } from 'lucide-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { PersonaSummary } from '../api/persona';

// const { width, height } = Dimensions.get('window');

// interface StoryboardSlide {
//   id: number;
//   title: string;
//   content: string;
//   icon: any;
//   color: string;
//   gradient: string[];
//   image?: string;
// }

// export default function PersonaStoryboardScreen() {
//   const router = useRouter();
//   const [summary, setSummary] = useState<PersonaSummary | null>(null);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [slides, setSlides] = useState<StoryboardSlide[]>([]);
//   const [isComplete, setIsComplete] = useState(false);

//   const slideOpacity = useSharedValue(0);
//   const slideTranslateX = useSharedValue(50);
//   const sparkleRotation = useSharedValue(0);
//   const progressWidth = useSharedValue(0);

//   useEffect(() => {
//     const fetchPersonaData = async () => {
//       try {
//         const storedSummary = await AsyncStorage.getItem('personaSummary');
//         if (storedSummary) {
//           const parsedSummary = JSON.parse(storedSummary);
//           setSummary(parsedSummary);
//           generateStoryboardSlides(parsedSummary);
//         }
//       } catch (error) {
//         console.error('Error fetching persona data:', error);
//       }
//     };

//     fetchPersonaData();

//     sparkleRotation.value = withRepeat(
//       withSequence(
//         withSpring(360, { duration: 6000 }),
//         withSpring(0, { duration: 6000 })
//       ),
//       -1
//     );
//   }, []);

//   useEffect(() => {
//     if (slides.length > 0) {
//       animateSlideIn();
//       updateProgress();
//     }
//   }, [currentSlide, slides.length]);

//   const generateStoryboardSlides = (personaSummary: PersonaSummary) => {
//     const storySlides: StoryboardSlide[] = [
//       {
//         id: 1,
//         title: 'Welcome to Your AI Profile',
//         content:
//           'Kai has analyzed your digital presence to create a personalized luxury experience tailored just for you.',
//         icon: Bot,
//         color: '#FFD700',
//         gradient: ['#FFD700', '#FFA500'],
//         image:
//           'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
//       },
//       {
//         id: 2,
//         title: 'Your Demographics',
//         content:
//           personaSummary.demographics ||
//           "Based on your profile, we've identified key demographic insights that help us understand your lifestyle preferences.",
//         icon: User,
//         color: '#4ECDC4',
//         gradient: ['#4ECDC4', '#44A08D'],
//         image:
//           'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800',
//       },
//       {
//         id: 3,
//         title: 'Your Personality Profile',
//         content:
//           personaSummary.personality ||
//           'Your unique personality traits guide how we curate experiences and recommendations for you.',
//         icon: Heart,
//         color: '#FF6B6B',
//         gradient: ['#FF6B6B', '#FF8E8E'],
//         image:
//           'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800',
//       },
//       {
//         id: 4,
//         title: 'Your Interests & Passions',
//         content:
//           personaSummary.interests ||
//           "We've identified your key interests to provide relevant luxury services and experiences.",
//         icon: Star,
//         color: '#96CEB4',
//         gradient: ['#96CEB4', '#FFECD2'],
//         image:
//           'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800',
//       },
//       {
//         id: 5,
//         title: 'Shopping Preferences',
//         content:
//           personaSummary.shopping ||
//           'Your shopping behavior helps us recommend the perfect luxury brands and experiences.',
//         icon: ShoppingBag,
//         color: '#A8E6CF',
//         gradient: ['#A8E6CF', '#DCEDC8'],
//         image:
//           'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
//       },
//       {
//         id: 6,
//         title: 'Personalized Recommendations',
//         content:
//           personaSummary.recommendations ||
//           'Based on your profile, here are our curated recommendations for your luxury lifestyle.',
//         icon: Target,
//         color: '#FFD93D',
//         gradient: ['#FFD93D', '#FF6B6B'],
//         image:
//           'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
//       },
//     ];

//     // Add key insights as individual slides
//     if (personaSummary.key_insights && personaSummary.key_insights.length > 0) {
//       personaSummary.key_insights.forEach((insight, index) => {
//         storySlides.push({
//           id: 7 + index,
//           title: `Key Insight ${index + 1}`,
//           content: insight,
//           icon: Sparkles,
//           color: '#81C784',
//           gradient: ['#81C784', '#AED581'],
//           image:
//             'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
//         });
//       });
//     }

//     // Final slide
//     storySlides.push({
//       id: 100,
//       title: 'Your Luxury Journey Begins',
//       content:
//         "Kai is now ready to assist you with personalized luxury services. Let's start your premium experience!",
//       icon: Crown,
//       color: '#FFD700',
//       gradient: ['#FFD700', '#FFA500'],
//       image:
//         'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
//     });

//     setSlides(storySlides);
//   };

//   const animateSlideIn = () => {
//     slideOpacity.value = 0;
//     slideTranslateX.value = 50;

//     slideOpacity.value = withSpring(1, { damping: 15 });
//     slideTranslateX.value = withSpring(0, { damping: 15 });
//   };

//   const updateProgress = () => {
//     const progress = slides.length > 0 ? (currentSlide + 1) / slides.length : 0;
//     progressWidth.value = withSpring(progress);
//   };

//   const nextSlide = () => {
//     if (currentSlide < slides.length - 1) {
//       setCurrentSlide(currentSlide + 1);
//     } else {
//       setIsComplete(true);
//       setTimeout(() => {
//         router.replace('/(tabs)/chat');
//       }, 2000);
//     }
//   };

//   const skipToChat = () => {
//     router.replace('/(tabs)/chat');
//   };

//   const slideAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: slideOpacity.value,
//     transform: [{ translateX: slideTranslateX.value }],
//   }));

//   const sparkleAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ rotate: `${sparkleRotation.value}deg` }],
//   }));

//   const progressAnimatedStyle = useAnimatedStyle(() => ({
//     width: `${progressWidth.value * 100}%`,
//   }));

//   if (!slides.length) {
//     return (
//       <View style={styles.loadingContainer}>
//         <LinearGradient
//           colors={['#0A0A0A', '#1A1A1A']}
//           style={styles.backgroundGradient}
//         />
//         <Text style={styles.loadingText}>Preparing your story...</Text>
//       </View>
//     );
//   }

//   if (isComplete) {
//     return (
//       <View style={styles.container}>
//         <LinearGradient
//           colors={['#0A0A0A', '#1A1A1A']}
//           style={styles.backgroundGradient}
//         />
//         <SafeAreaView style={styles.safeArea}>
//           <View style={styles.completeContainer}>
//             <View style={styles.completeIconContainer}>
//               <LinearGradient
//                 colors={['#FFD700', '#FFA500']}
//                 style={styles.completeIcon}
//               >
//                 <CheckCircle size={48} color="#0A0A0A" />
//               </LinearGradient>
//             </View>
//             <Text style={styles.completeTitle}>Profile Complete!</Text>
//             <Text style={styles.completeSubtitle}>
//               Kai is ready to assist you with personalized luxury services
//             </Text>
//           </View>
//         </SafeAreaView>
//       </View>
//     );
//   }

//   const currentSlideData = slides[currentSlide];

//   return (
//     <View style={styles.container}>
//       <LinearGradient
//         colors={['#0A0A0A', '#1A1A1A']}
//         style={styles.backgroundGradient}
//       />

//       <SafeAreaView style={styles.safeArea}>
//         {/* Header with Progress */}
//         <View style={styles.header}>
//           <View style={styles.progressContainer}>
//             <View style={styles.progressBar}>
//               <Animated.View
//                 style={[styles.progressFill, progressAnimatedStyle]}
//               />
//             </View>
//             <Text style={styles.progressText}>
//               {currentSlide + 1} of {slides.length}
//             </Text>
//           </View>
//           <TouchableOpacity style={styles.skipButton} onPress={skipToChat}>
//             <Text style={styles.skipText}>Skip</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Main Content */}
//         <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//           <Animated.View style={[styles.slideContainer, slideAnimatedStyle]}>
//             {/* Hero Image */}
//             <View style={styles.imageContainer}>
//               <Image
//                 source={{ uri: currentSlideData.image }}
//                 style={styles.slideImage}
//               />
//               <LinearGradient
//                 colors={['transparent', 'rgba(0,0,0,0.8)']}
//                 style={styles.imageOverlay}
//               />
//               <View style={styles.iconContainer}>
//                 <LinearGradient
//                   colors={currentSlideData.gradient as [import('react-native').ColorValue, import('react-native').ColorValue, ...(import('react-native').ColorValue[])]}
//                   style={styles.iconGradient}
//                 >
//                   <currentSlideData.icon size={32} color="#FFFFFF" />
//                 </LinearGradient>
//               </View>
//             </View>

//             {/* Content */}
//             <View style={styles.textContent}>
//               <Text style={styles.slideTitle}>{currentSlideData.title}</Text>
//               <Text style={styles.slideContent}>
//                 {currentSlideData.content}
//               </Text>
//             </View>

//             {/* Decorative Elements */}
//             <View style={styles.decorativeElements}>
//               <Animated.View
//                 style={[
//                   styles.sparkle,
//                   { top: 50, left: 30 },
//                   sparkleAnimatedStyle,
//                 ]}
//               >
//                 <Sparkles size={16} color="#FFD700" />
//               </Animated.View>
//               <Animated.View
//                 style={[
//                   styles.sparkle,
//                   { top: 120, right: 40 },
//                   sparkleAnimatedStyle,
//                 ]}
//               >
//                 <Star size={14} color="#FFD700" />
//               </Animated.View>
//               <Animated.View
//                 style={[
//                   styles.sparkle,
//                   { bottom: 100, left: 50 },
//                   sparkleAnimatedStyle,
//                 ]}
//               >
//                 <Crown size={18} color="#FFD700" />
//               </Animated.View>
//             </View>
//           </Animated.View>
//         </ScrollView>

//         {/* Navigation */}
//         <View style={styles.navigation}>
//           <TouchableOpacity style={styles.nextButton} onPress={nextSlide}>
//             <BlurView intensity={20} style={styles.nextButtonBlur}>
//               <Text style={styles.nextButtonText}>
//                 {currentSlide === slides.length - 1
//                   ? 'Start Experience'
//                   : 'Continue'}
//               </Text>
//               <ArrowRight size={20} color="#0A0A0A" />
//             </BlurView>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0A0A0A',
//   },
//   backgroundGradient: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     fontFamily: 'Inter-Medium',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//   },
//   progressContainer: {
//     flex: 1,
//     marginRight: 16,
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderRadius: 2,
//     overflow: 'hidden',
//     marginBottom: 8,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#FFD700',
//     borderRadius: 2,
//   },
//   progressText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//     color: '#CCCCCC',
//   },
//   skipButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   skipText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#FFD700',
//   },
//   content: {
//     flex: 1,
//   },
//   slideContainer: {
//     paddingHorizontal: 24,
//     paddingBottom: 100,
//   },
//   imageContainer: {
//     position: 'relative',
//     height: height * 0.4,
//     borderRadius: 20,
//     overflow: 'hidden',
//     marginBottom: 32,
//   },
//   slideImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   imageOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '50%',
//   },
//   iconContainer: {
//     position: 'absolute',
//     bottom: 20,
//     right: 20,
//   },
//   iconGradient: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   textContent: {
//     marginBottom: 32,
//   },
//   slideTitle: {
//     fontSize: 28,
//     fontFamily: 'Playfair-Bold',
//     color: '#FFFFFF',
//     marginBottom: 16,
//     lineHeight: 36,
//   },
//   slideContent: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#CCCCCC',
//     lineHeight: 24,
//   },
//   decorativeElements: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     pointerEvents: 'none',
//   },
//   sparkle: {
//     position: 'absolute',
//     opacity: 0.6,
//   },
//   navigation: {
//     paddingHorizontal: 24,
//     paddingBottom: 24,
//   },
//   nextButton: {
//     borderRadius: 16,
//     overflow: 'hidden',
//   },
//   nextButtonBlur: {
//     backgroundColor: '#FFD700',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//   },
//   nextButtonText: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#0A0A0A',
//     marginRight: 8,
//   },
//   completeContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   completeIconContainer: {
//     marginBottom: 32,
//   },
//   completeIcon: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#FFD700',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   completeTitle: {
//     fontSize: 32,
//     fontFamily: 'Playfair-Bold',
//     color: '#FFFFFF',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   completeSubtitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#CCCCCC',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
// });

// Enhanced Persona Storyboard with luxury styling

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
  withRepeat,
  withSequence,
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
    content: any;
    image: string;
    icon: any;
  }

  const [summary, setSummary] = useState<any>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const imageScale = useSharedValue(1);
  const slideOpacity = useSharedValue(0);
  const slideTranslateX = useSharedValue(50);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    const fetchData = async () => {
      const raw = await AsyncStorage.getItem('personaSummary');
      if (raw) {
        const parsed = JSON.parse(raw);
        setSummary(parsed);
        setSlides([
          {
            id: 1,
            title: 'Your Demographics',
            content: parsed.demographics,
            image:
              'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg',
            icon: User,
          },
          {
            id: 2,
            title: 'Personality Profile',
            content: parsed.personality,
            image:
              'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
            icon: Heart,
          },
          {
            id: 3,
            title: 'Interests & Hobbies',
            content: parsed.interests,
            image:
              'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
            icon: Star,
          },
          {
            id: 4,
            title: 'Shopping Preferences',
            content: parsed.shopping,
            image:
              'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg',
            icon: ShoppingBag,
          },
          {
            id: 5,
            title: 'Recommendations',
            content: parsed.recommendations,
            image:
              'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg',
            icon: Target,
          },
        ]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    imageScale.value = withTiming(1.05, { duration: 5000 });
    slideOpacity.value = withSpring(1);
    slideTranslateX.value = withSpring(0);
    progressWidth.value = withSpring((currentSlide + 1) / (slides.length || 1));
  }, [currentSlide]);

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

  if (!slides.length) return <Text style={{ color: '#fff' }}>Loading...</Text>;

  const current = slides[currentSlide];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A']}
        style={styles.background}
      />
      <SafeAreaView style={{ flex: 1 }}>
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
            if (currentSlide < slides.length - 1)
              setCurrentSlide(currentSlide + 1);
            else {
              setIsComplete(true);
              router.replace('/(tabs)/chat');
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
});
