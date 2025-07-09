import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  ActivityIndicator,
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

const SCRAPE_ENDPOINTS: Record<Platform, string> = {
  instagram:
    'https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/scrape/instagram',
  twitter:
    'https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/scrape/twitter',
  linkedin:
    'https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/scrape/linkedin',
};

const PERSONA_ENDPOINT =
  'https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/generate-persona';

export default function OnboardingScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [usernames, setUsernames] = useState<Record<Platform, string>>({
    instagram: '',
    twitter: '',
    linkedin: '',
  });
  const [connected, setConnected] = useState<Record<Platform, boolean>>({
    instagram: false,
    twitter: false,
    linkedin: false,
  });
  const [loading, setLoading] = useState<Record<Platform, boolean>>({
    instagram: false,
    twitter: false,
    linkedin: false,
  });
  const [profileData, setProfileData] = useState<Record<Platform, any>>({
    instagram: null,
    twitter: null,
    linkedin: null,
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
    // Get current user from auth
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      console.log(
        '✅ Onboarding: User already authenticated:',
        currentUser.email
      );
      // Save user info to AsyncStorage
      saveUserToAsyncStorage({
        userId: currentUser.uid,
        email: currentUser.email || '',
        displayName: currentUser.displayName || '',
      }).catch((err) => {
        console.error('Error saving user to AsyncStorage:', err);
      });
    } else {
      console.log('⚠️ Onboarding: No current user, waiting for auth state');
    }

    // Load existing connected platforms
    loadExistingConnections();
  }, []);

  const loadExistingConnections = async () => {
    try {
      const userDataRaw = await AsyncStorage.getItem('userData');
      if (userDataRaw) {
        const userData = JSON.parse(userDataRaw);
        if (userData.usernames) {
          setUsernames(userData.usernames);

          // Check which platforms are already connected
          const newConnected = { ...connected };
          const newProfileData = { ...profileData };

          for (const platform of platforms) {
            if (userData.usernames[platform]) {
              // Check if we have stored data for this platform
              const socialDataRaw = await AsyncStorage.getItem(
                `socialData_${platform}`
              );
              if (socialDataRaw) {
                const socialData = JSON.parse(socialDataRaw);
                newConnected[platform] = true;
                newProfileData[platform] = socialData;
                console.log(`✅ Loaded existing ${platform} connection`);
              }
            }
          }

          setConnected(newConnected);
          setProfileData(newProfileData);
        }
      }
    } catch (error) {
      console.error('Error loading existing connections:', error);
    }
  };

  const saveUserToAsyncStorage = async (userData: any) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('✅ User data saved to AsyncStorage');
    } catch (err) {
      console.error('Error saving user data to AsyncStorage:', err);
    }
  };

  const saveSocialDataToAsyncStorage = async (
    platform: Platform,
    data: any
  ) => {
    try {
      const key = `socialData_${platform}`;
      await AsyncStorage.setItem(key, JSON.stringify(data));
      console.log(`✅ ${platform} data saved to AsyncStorage`);
    } catch (err) {
      console.error(`Error saving ${platform} data to AsyncStorage:`, err);
    }
  };

  const savePersonaToAsyncStorage = async (data: any) => {
    try {
      await AsyncStorage.setItem('personaData', JSON.stringify(data));
      console.log('✅ Persona data saved to AsyncStorage');
    } catch (err) {
      console.error('Error saving persona data to AsyncStorage:', err);
    }
  };

  const handleConnect = async (platform: Platform) => {
    if (!usernames[platform].trim()) {
      setError(
        `Please enter your ${platform} ${
          platform === 'linkedin' ? 'profile URL' : 'username'
        }.`
      );
      return;
    }
    setError('');
    setLoading((prev) => ({ ...prev, [platform]: true }));
    try {
      console.log(
        `🔄 Connecting ${platform} with username:`,
        usernames[platform]
      );

      let body: any = {};
      if (platform === 'linkedin') {
        body.url = usernames[platform];
      } else {
        body.username = usernames[platform];
      }

      console.log(
        `📡 Making request to ${SCRAPE_ENDPOINTS[platform]} with body:`,
        body
      );

      const res = await fetch(SCRAPE_ENDPOINTS[platform], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log(`📊 Response status for ${platform}:`, res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ API error for ${platform}:`, errorText);
        throw new Error(`Failed to fetch profile data: ${res.status}`);
      }

      const data = await res.json();
      console.log(`✅ Received data for ${platform}:`, data);

      setProfileData((prev) => ({ ...prev, [platform]: data }));
      setConnected((prev) => ({ ...prev, [platform]: true }));

      // Save username and profileData to AsyncStorage
      if (user) {
        try {
          console.log(`💾 Saving ${platform} data to AsyncStorage...`);

          // Update usernames in AsyncStorage
          const existingUserData = await AsyncStorage.getItem('userData');
          const userData = existingUserData ? JSON.parse(existingUserData) : {};
          userData.usernames = {
            ...userData.usernames,
            [platform]: usernames[platform],
          };
          await AsyncStorage.setItem('userData', JSON.stringify(userData));
          console.log(
            `✅ Saved username for ${platform}:`,
            usernames[platform]
          );

          // Save social media data to AsyncStorage
          await saveSocialDataToAsyncStorage(platform, data);
          console.log(`✅ Saved ${platform} data to AsyncStorage`);

          // Verify the data was saved
          const savedData = await AsyncStorage.getItem(
            `socialData_${platform}`
          );
          console.log(
            `🔍 Verification - saved ${platform} data:`,
            savedData ? 'Found' : 'Not found'
          );
        } catch (err) {
          console.error(
            `❌ Error saving ${platform} data to AsyncStorage:`,
            err
          );
        }
      } else {
        console.warn('⚠️ No user available for saving data');
      }
    } catch (err) {
      setError(
        `Failed to connect ${platform}: ${
          err instanceof Error ? err.message : 'Unknown error'
        }`
      );
      console.error(`❌ Connect error for ${platform}:`, err);
    } finally {
      setLoading((prev) => ({ ...prev, [platform]: false }));
    }
  };

  const handleGeneratePersona = async () => {
    if (!user) {
      setError('User not authenticated.');
      console.error('User not authenticated, cannot save to AsyncStorage.');
      return;
    }
    setIsAnalyzing(true);
    setError('');
    try {
      // Merge all available profileData into one array
      const allData = Object.entries(profileData)
        .filter(([_, data]) => data && Array.isArray(data))
        .flatMap(([_, data]) => data);
      if (allData.length === 0) {
        setError('No social data available to generate persona.');
        setIsAnalyzing(false);
        return;
      }
      // Use the first connected platform for persona platform/username
      const firstPlatform = platforms.find((p) => connected[p]);
      const personaReq = {
        platform: firstPlatform,
        username: usernames[firstPlatform!],
        profileData: allData,
      };
      const res = await fetch(PERSONA_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personaReq),
      });
      if (!res.ok) throw new Error('Failed to generate persona');
      const personaResult = await res.json();
      setPersona(personaResult);

      // Save persona to AsyncStorage
      try {
        await savePersonaToAsyncStorage(personaResult);
        console.log('✅ Saved persona to AsyncStorage:', personaResult);

        // Mark onboarding as complete
        await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

        // Navigate to persona storyboard
        router.replace('/persona-storyboard');
      } catch (err) {
        console.error('Error saving persona to AsyncStorage:', err);
        setError('Failed to save persona data.');
      }
    } catch (err) {
      setError('Failed to generate persona.');
      console.error('Persona generation error:', err);
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
                placeholder={
                  platform === 'linkedin'
                    ? 'LinkedIn profile URL'
                    : `${platform} username`
                }
                value={usernames[platform]}
                onChangeText={(text) =>
                  setUsernames((prev) => ({ ...prev, [platform]: text }))
                }
                placeholderTextColor="#666666"
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                editable={!connected[platform]}
              />
              <TouchableOpacity
                style={{
                  marginLeft: 8,
                  backgroundColor: connected[platform] ? '#4CAF50' : '#FFD700',
                  borderRadius: 8,
                  padding: 8,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => handleConnect(platform)}
                disabled={connected[platform] || loading[platform]}
              >
                {loading[platform] ? (
                  <ActivityIndicator color="#0A0A0A" size="small" />
                ) : (
                  <Text style={{ color: '#0A0A0A', fontWeight: 'bold' }}>
                    {connected[platform] ? 'Connected' : 'Connect'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ))}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={{
              backgroundColor: Object.values(connected).some(Boolean)
                ? '#FFD700'
                : '#999',
              borderRadius: 16,
              padding: 16,
              marginTop: 16,
            }}
            onPress={handleGeneratePersona}
            disabled={!Object.values(connected).some(Boolean) || isAnalyzing}
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
              shadowColor: '#FFD700',
              shadowOpacity: 0.3,
              shadowRadius: 10,
            }}
          >
            <Text
              style={{
                color: '#FFD700',
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 12,
                textAlign: 'center',
              }}
            >
              Your Persona
            </Text>
            {persona.title && (
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  marginBottom: 16,
                  textAlign: 'center',
                }}
              >
                {persona.title}
              </Text>
            )}
            {persona.sections && Array.isArray(persona.sections) ? (
              persona.sections.map((section: any, index: number) => (
                <View key={index} style={{ marginBottom: 16 }}>
                  <Text
                    style={{
                      color: '#FFD700',
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginBottom: 8,
                    }}
                  >
                    {section.heading}
                  </Text>
                  <Text style={{ color: '#fff', fontSize: 14, lineHeight: 20 }}>
                    {section.content}
                  </Text>
                </View>
              ))
            ) : persona.summary ? (
              <>
                <Text style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>
                  Key Insights:
                </Text>
                {Array.isArray(persona.summary.key_insights) ? (
                  persona.summary.key_insights.map(
                    (point: string, i: number) => (
                      <Text
                        key={i}
                        style={{ color: '#FFD700', marginBottom: 4 }}
                      >
                        • {point}
                      </Text>
                    )
                  )
                ) : (
                  <Text style={{ color: '#FFD700' }}>
                    {persona.summary.key_insights}
                  </Text>
                )}
                <Text style={{ color: '#fff', marginTop: 12 }}>
                  Personality:{' '}
                  <Text style={{ color: '#FFD700' }}>
                    {persona.summary.personality}
                  </Text>
                </Text>
                <Text style={{ color: '#fff' }}>
                  Interests:{' '}
                  <Text style={{ color: '#FFD700' }}>
                    {persona.summary.interests}
                  </Text>
                </Text>
                <Text style={{ color: '#fff' }}>
                  Shopping:{' '}
                  <Text style={{ color: '#FFD700' }}>
                    {persona.summary.shopping}
                  </Text>
                </Text>
                <Text style={{ color: '#fff' }}>
                  Recommendations:{' '}
                  <Text style={{ color: '#FFD700' }}>
                    {persona.summary.recommendations}
                  </Text>
                </Text>
              </>
            ) : (
              <Text style={{ color: 'red' }}>No persona data available.</Text>
            )}
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
