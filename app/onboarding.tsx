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
import { db, auth } from '../hooks/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

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

// Add this type for platform keys
const platforms = ['instagram', 'twitter', 'linkedin'] as const;
type Platform = (typeof platforms)[number];

export default function OnboardingScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [usernames, setUsernames] = useState<Record<Platform, string>>({
    instagram: '',
    twitter: '',
    linkedin: '',
  });
  const [persona, setPersona] = useState<any>(null);
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      console.log('onAuthStateChanged user:', u);
      if (u === null) {
        console.warn('User not authenticated, redirecting to /sign-in');
        router.replace('/sign-in');
      } else {
        console.log('User authenticated:', u.email || u.uid);
      }
    });
    return unsubscribe;
  }, []);

  const handleConnect = async (
    platform: 'instagram' | 'twitter' | 'linkedin'
  ) => {
    if (!usernames[platform].trim()) {
      setError(`Please enter your ${platform} username.`);
      return;
    }
    setError('');
    // Optionally, validate username or do OAuth here
    alert(
      `${platform.charAt(0).toUpperCase() + platform.slice(1)} username set: ${
        usernames[platform]
      }`
    );
  };

  const handleGeneratePersona = async () => {
    if (!user) {
      setError('User not authenticated.');
      console.error('User not authenticated, cannot save to Firestore.');
      return;
    }
    setIsAnalyzing(true);
    setError('');
    try {
      // Save usernames to Firestore
      console.log('Saving to Firestore for user:', user?.uid, usernames);
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { usernames }, { merge: true });
      console.log('Saved usernames to Firestore');

      // Call BrightData for each platform and save persona
      const personaResults: any = {};
      for (const platform of platforms) {
        const username = usernames[platform];
        if (username) {
          try {
            const result = await generatePersona(platform, username);
            personaResults[platform] = result;
          } catch (err) {
            personaResults[platform] = { error: 'Failed to generate persona.' };
            console.error(`BrightData error for ${platform}:`, err);
          }
        }
      }
      await setDoc(userRef, { persona: personaResults }, { merge: true });
      console.log('Saved persona to Firestore:', personaResults);
      setPersona(personaResults);
    } catch (err) {
      setError('Failed to save data or generate persona.');
      console.error('Firestore error:', err);
    } finally {
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
              Kai is analyzing your {persona && persona.platform} profile to
              create your personalized experience
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
          <Text style={styles.socialTitle}>Enter your usernames</Text>
          {platforms.map((platform) => (
            <View
              key={platform}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  width: 90,
                  textTransform: 'capitalize',
                }}
              >
                {platform}:
              </Text>
              <TextInput
                placeholder={`${platform} username`}
                value={usernames[platform]}
                onChangeText={(text) =>
                  setUsernames((prev) => ({ ...prev, [platform]: text }))
                }
                placeholderTextColor="#666666"
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
              />
              <TouchableOpacity
                style={{
                  marginLeft: 8,
                  backgroundColor: '#FFD700',
                  borderRadius: 8,
                  padding: 8,
                }}
                onPress={() => handleConnect(platform)}
              >
                <Text style={{ color: '#0A0A0A', fontWeight: 'bold' }}>
                  Connect
                </Text>
              </TouchableOpacity>
            </View>
          ))}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={{
              backgroundColor: '#FFD700',
              borderRadius: 16,
              padding: 16,
              marginTop: 16,
            }}
            onPress={handleGeneratePersona}
            disabled={isAnalyzing}
          >
            <Text
              style={{
                color: '#0A0A0A',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Generate Persona
            </Text>
          </TouchableOpacity>
        </Animated.View>
        {persona && (
          <View
            style={{
              marginTop: 32,
              backgroundColor: '#222',
              borderRadius: 16,
              padding: 16,
            }}
          >
            <Text
              style={{
                color: '#FFD700',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 8,
              }}
            >
              Persona Results
            </Text>
            {Object.entries(persona).map(([platform, result]) => (
              <View key={platform} style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}
                >
                  {platform}
                </Text>
                {result && typeof result === 'object' && 'summary' in result ? (
                  <Text style={{ color: '#fff' }}>
                    {JSON.stringify(result.summary, null, 2)}
                  </Text>
                ) : result &&
                  typeof result === 'object' &&
                  'error' in result ? (
                  <Text style={{ color: 'red' }}>
                    {(result as any).error || 'No data'}
                  </Text>
                ) : (
                  <Text style={{ color: 'red' }}>No data</Text>
                )}
              </View>
            ))}
          </View>
        )}
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
