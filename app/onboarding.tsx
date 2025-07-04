import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import {
  Sparkles,
  Bot,
  Star,
  Crown,
  Instagram,
  Twitter,
  Linkedin,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generatePersona, PersonaSummary } from '../api/persona';

const { width } = Dimensions.get('window');

const socialPlatforms = [
  {
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    value: 'instagram',
  },
  {
    name: 'X (Twitter)',
    icon: Twitter,
    color: '#1DA1F2',
    value: 'twitter',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0077B5',
    value: 'linkedin',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const titleScale = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const socialButtonsOpacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);

  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: titleScale.value }],
  }));
  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));
  const socialAnimatedStyle = useAnimatedStyle(() => ({
    opacity: socialButtonsOpacity.value,
  }));
  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1.value }],
  }));
  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2.value }],
  }));
  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3.value }],
  }));

  useEffect(() => {
    titleScale.value = withDelay(300, withSpring(1, { damping: 15 }));
    subtitleOpacity.value = withDelay(600, withSpring(1));
    socialButtonsOpacity.value = withDelay(900, withSpring(1));
    sparkleRotation.value = withRepeat(
      withSequence(withSpring(360), withSpring(0)),
      -1
    );
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      const bounce = (dot: any, delay: number) => {
        dot.value = withDelay(
          delay,
          withRepeat(
            withSequence(
              withSpring(-10, { damping: 6 }),
              withSpring(0, { damping: 6 })
            ),
            -1,
            false
          )
        );
      };

      bounce(dot1, 0);
      bounce(dot2, 200);
      bounce(dot3, 400);
    }
  }, [isAnalyzing]);

  const handleSocialLogin = async (platform: string) => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setSelectedPlatform(platform);
    setIsAnalyzing(true);
    setError('');

    try {
      const result = await generatePersona(
        platform as 'instagram' | 'twitter' | 'linkedin',
        username.trim()
      );

      await AsyncStorage.setItem('personaSummary', JSON.stringify(result));
      await AsyncStorage.setItem('personaFullAnalysis', result.full_analysis);

      setTimeout(() => router.replace('/persona-storyboard' as any), 1000);
    } catch (err) {
      setError('Failed to generate persona. Please try again.');
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <Animated.View
          style={[
            styles.floatingElement,
            { top: 100, left: 50 },
            sparkleAnimatedStyle,
          ]}
        >
          <Sparkles size={20} color="#FFD700" />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingElement,
            { top: 200, right: 80 },
            sparkleAnimatedStyle,
          ]}
        >
          <Star size={16} color="#FFD700" />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingElement,
            { bottom: 300, left: 30 },
            sparkleAnimatedStyle,
          ]}
        >
          <Crown size={18} color="#FFD700" />
        </Animated.View>

        <View style={styles.analysisContainer}>
          <View style={styles.analysisContent}>
            <View style={styles.aiIconContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FFD700']}
                style={styles.aiIconGradient}
              >
                <Bot size={48} color="#0A0A0A" />
              </LinearGradient>
            </View>
            <Text style={styles.analysisTitle}>AI Profile Analysis</Text>
            <Text style={styles.analysisSubtitle}>
              Kai is analyzing your {selectedPlatform} profile to create your
              personalized experience
            </Text>

            {/* Bouncing Dots Loader */}
            <View style={styles.loaderDots}>
              <Animated.View style={[styles.dot, dot1Style]} />
              <Animated.View style={[styles.dot, dot2Style]} />
              <Animated.View style={[styles.dot, dot3Style]} />
            </View>

            <Text style={styles.currentStep}>
              Creating your luxury lifestyle profile...
            </Text>
            <View style={styles.analysisFeatures}>
              <View style={styles.featureItem}>
                <Sparkles size={16} color="#FFD700" />
                <Text style={styles.featureText}>
                  Learning your preferences
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Crown size={16} color="#FFD700" />
                <Text style={styles.featureText}>
                  Personalizing luxury services
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={16} color="#FFD700" />
                <Text style={styles.featureText}>
                  Optimizing your experience
                </Text>
              </View>
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View
        style={[
          styles.floatingElement,
          { top: 100, left: 50 },
          sparkleAnimatedStyle,
        ]}
      >
        <Sparkles size={20} color="#FFD700" />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatingElement,
          { top: 200, right: 80 },
          sparkleAnimatedStyle,
        ]}
      >
        <Star size={16} color="#FFD700" />
      </Animated.View>
      <Animated.View
        style={[
          styles.floatingElement,
          { bottom: 300, left: 30 },
          sparkleAnimatedStyle,
        ]}
      >
        <Crown size={18} color="#FFD700" />
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
            <Text style={styles.title}>Kai</Text>
            <Text style={styles.titleAccent}>Concierge</Text>
          </Animated.View>
          <Animated.View style={subtitleAnimatedStyle}>
            <Text style={styles.subtitle}>
              Your personal AI assistant for luxury living
            </Text>
            <Text style={styles.description}>
              Connect your social profiles to unlock personalized
              recommendations and seamless service
            </Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.socialContainer, socialAnimatedStyle]}>
          <Text style={styles.socialTitle}>Enter your username</Text>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#666666"
            style={styles.input}
          />

          <Text style={styles.platformTitle}>Choose your platform</Text>
          {socialPlatforms.map((platform) => (
            <TouchableOpacity
              key={platform.name}
              style={styles.socialButton}
              onPress={() => handleSocialLogin(platform.value)}
              disabled={!username.trim()}
            >
              <BlurView intensity={20} style={styles.socialButtonBlur}>
                <View
                  style={[
                    styles.socialIconContainer,
                    { backgroundColor: platform.color },
                  ]}
                >
                  <platform.icon size={20} color="#FFFFFF" />
                </View>
                <View style={styles.socialTextContainer}>
                  <Text style={styles.socialText}>
                    Connect with {platform.name}
                  </Text>
                  <Text style={styles.socialDescription}>
                    Analyze your {platform.name.toLowerCase()} profile
                  </Text>
                </View>
                <View style={styles.securityBadge}>
                  <Text style={styles.securityText}>Secure</Text>
                </View>
              </BlurView>
            </TouchableOpacity>
          ))}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  floatingElement: {
    position: 'absolute',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginRight: 8,
  },
  titleAccent: {
    fontSize: 48,
    fontFamily: 'Playfair-Bold',
    color: '#FFD700',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
  socialContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  socialTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  platformTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  socialButton: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  socialButtonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  socialIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  socialTextContainer: {
    flex: 1,
  },
  socialText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  socialDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  securityBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.4)',
  },
  securityText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#4CAF50',
  },
  error: {
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  analysisContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  analysisContent: {
    alignItems: 'center',
    width: '100%',
  },
  aiIconContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  aiIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  analysisTitle: {
    fontSize: 24,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 8,
  },
  analysisSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  loaderDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 24,
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFD700',
  },
  currentStep: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
  },
  analysisFeatures: {
    alignItems: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginLeft: 8,
  },
});
