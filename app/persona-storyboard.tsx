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
  withDelay,
  Easing,
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
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../hooks/firebaseConfig';

const { width, height } = Dimensions.get('window');

interface Slide {
  title: string;
  content: string;
  image: string;
  icon: any;
}

export default function PersonaStoryboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [personaData, setPersonaData] = useState<any>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageScale = useSharedValue(1);
  const slideOpacity = useSharedValue(0);
  const slideTranslateX = useSharedValue(50);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u === null) {
        router.replace('/sign-in');
      } else {
        await loadPersonaData();
      }
    });
    return unsubscribe;
  }, []);

  const loadPersonaData = async () => {
    setIsLoading(true);
    try {
      // Load persona data from AsyncStorage
      const raw = await AsyncStorage.getItem('personaData');
      if (raw) {
        const parsed = JSON.parse(raw);
        console.log('✅ Loaded persona data from AsyncStorage:', parsed);
        setPersonaData(parsed);

        // Convert the new API response structure to slides
        if (parsed.sections && Array.isArray(parsed.sections)) {
          const icons = [User, Heart, Star, ShoppingBag, Target];
          const processedSlides = parsed.sections.map(
            (section: any, index: number) => ({
              title: section.heading || 'Slide Title',
              content: section.content || 'Slide content',
              image: `https://picsum.photos/400/300?random=${index}`,
              icon: icons[index % icons.length],
            })
          ) as Slide[];

          setSlides(processedSlides);
        } else {
          // Fallback for old structure
          console.log('⚠️ Using fallback persona structure');
          const fallbackSlides = [
            {
              title: 'Your Digital Identity',
              content:
                "Based on your social media presence, we've analyzed your digital footprint and preferences.",
              image: 'https://picsum.photos/400/300?random=1',
              icon: User,
            },
            {
              title: 'Personality Insights',
              content:
                'Your online behavior reveals a creative and tech-savvy personality with a passion for innovation.',
              image: 'https://picsum.photos/400/300?random=2',
              icon: Heart,
            },
            {
              title: 'Interests & Habits',
              content:
                "We've identified your key interests in technology, finance, and lifestyle content.",
              image: 'https://picsum.photos/400/300?random=3',
              icon: Star,
            },
            {
              title: 'Shopping Preferences',
              content:
                'Your shopping behavior shows a preference for quality over quantity, with a focus on tech and lifestyle products.',
              image: 'https://picsum.photos/400/300?random=4',
              icon: ShoppingBag,
            },
            {
              title: 'Personalized Recommendations',
              content:
                "Based on your profile, we'll curate luxury experiences and services tailored to your preferences.",
              image: 'https://picsum.photos/400/300?random=5',
              icon: Target,
            },
          ];
          setSlides(fallbackSlides);
        }
      } else {
        console.log('⚠️ No persona data found, using default slides');
        // Default slides if no data
        const defaultSlides = [
          {
            title: 'Your Digital Identity',
            content:
              "Based on your social media presence, we've analyzed your digital footprint and preferences.",
            image: 'https://picsum.photos/400/300?random=1',
            icon: User,
          },
          {
            title: 'Personality Insights',
            content:
              'Your online behavior reveals a creative and tech-savvy personality with a passion for innovation.',
            image: 'https://picsum.photos/400/300?random=2',
            icon: Heart,
          },
          {
            title: 'Interests & Habits',
            content:
              "We've identified your key interests in technology, finance, and lifestyle content.",
            image: 'https://picsum.photos/400/300?random=3',
            icon: Star,
          },
          {
            title: 'Shopping Preferences',
            content:
              'Your shopping behavior shows a preference for quality over quantity, with a focus on tech and lifestyle products.',
            image: 'https://picsum.photos/400/300?random=4',
            icon: ShoppingBag,
          },
          {
            title: 'Personalized Recommendations',
            content:
              "Based on your profile, we'll curate luxury experiences and services tailored to your preferences.",
            image: 'https://picsum.photos/400/300?random=5',
            icon: Target,
          },
        ];
        setSlides(defaultSlides);
      }
    } catch (error) {
      console.error('❌ Error loading persona data:', error);
      // Set default slides on error
      const defaultSlides = [
        {
          title: 'Your Digital Identity',
          content:
            "Based on your social media presence, we've analyzed your digital footprint and preferences.",
          image: 'https://picsum.photos/400/300?random=1',
          icon: User,
        },
        {
          title: 'Personality Insights',
          content:
            'Your online behavior reveals a creative and tech-savvy personality with a passion for innovation.',
          image: 'https://picsum.photos/400/300?random=2',
          icon: Heart,
        },
        {
          title: 'Interests & Habits',
          content:
            "We've identified your key interests in technology, finance, and lifestyle content.",
          image: 'https://picsum.photos/400/300?random=3',
          icon: Star,
        },
        {
          title: 'Shopping Preferences',
          content:
            'Your shopping behavior shows a preference for quality over quantity, with a focus on tech and lifestyle products.',
          image: 'https://picsum.photos/400/300?random=4',
          icon: ShoppingBag,
        },
        {
          title: 'Personalized Recommendations',
          content:
            "Based on your profile, we'll curate luxury experiences and services tailored to your preferences.",
          image: 'https://picsum.photos/400/300?random=5',
          icon: Target,
        },
      ];
      setSlides(defaultSlides);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slides.length > 0) {
      // Animate progress bar
      progressWidth.value = withTiming(
        ((currentSlide + 1) / slides.length) * (width - 40),
        { duration: 500, easing: Easing.out(Easing.quad) }
      );

      // Animate slide transition
      slideOpacity.value = 0;
      slideTranslateX.value = 50;

      slideOpacity.value = withDelay(
        100,
        withSpring(1, { damping: 15, stiffness: 100 })
      );
      slideTranslateX.value = withDelay(
        100,
        withSpring(0, { damping: 15, stiffness: 100 })
      );

      // Animate image scale
      imageScale.value = withDelay(
        200,
        withSpring(1, { damping: 15, stiffness: 100 })
      );
    }
  }, [currentSlide, slides]);

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    opacity: slideOpacity.value,
    transform: [{ translateX: slideTranslateX.value }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: progressWidth.value,
  }));

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A']}
          style={styles.background}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading your persona...</Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (slides.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A']}
          style={styles.background}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No persona data found</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => router.replace('/onboarding')}
            >
              <Text style={styles.retryButtonText}>Go to Onboarding</Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FFD700',
    padding: 16,
    borderRadius: 16,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#0A0A0A',
  },
});
