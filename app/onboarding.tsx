// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   TextInput,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur';
// import { useRouter } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withDelay,
//   withRepeat,
//   withSequence,
// } from 'react-native-reanimated';
// import {
//   Sparkles,
//   Bot,
//   Star,
//   Crown,
//   Instagram,
//   Twitter,
//   Linkedin,
// } from 'lucide-react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { generatePersona, PersonaSummary } from '../api/persona';

// const { width } = Dimensions.get('window');

// const socialPlatforms = [
//   {
//     name: 'Instagram',
//     icon: Instagram,
//     color: '#E4405F',
//     value: 'instagram',
//   },
//   {
//     name: 'X (Twitter)',
//     icon: Twitter,
//     color: '#1DA1F2',
//     value: 'twitter',
//   },
//   {
//     name: 'LinkedIn',
//     icon: Linkedin,
//     color: '#0077B5',
//     value: 'linkedin',
//   },
// ];

// export default function OnboardingScreen() {
//   const router = useRouter();
//   const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
//   const [username, setUsername] = useState('');
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [personaSummary, setPersonaSummary] = useState<PersonaSummary | null>(
//     null
//   );
//   const [error, setError] = useState('');

//   const progress = useSharedValue(0);

//   const progressAnimatedStyle = useAnimatedStyle(() => ({
//     width: `${progress.value * 100}%`,
//   }));

//   const handleSocialLogin = async (platform: string) => {
//     if (!username.trim()) {
//       setError('Username is required');
//       return;
//     }

//     setSelectedPlatform(platform);
//     setIsAnalyzing(true);
//     setError('');

//     try {
//       const result = await generatePersona(
//         platform as 'instagram' | 'twitter' | 'linkedin',
//         username.trim()
//       );
//       setPersonaSummary(result.summary);
//       await AsyncStorage.setItem(
//         'personaSummary',
//         JSON.stringify(result.summary)
//       );
//       router.replace('/(tabs)/persona' as any);
//     } catch (err) {
//       setError('Failed to generate persona. Please try again.');
//       setIsAnalyzing(false);
//     }
//   };

//   if (isAnalyzing) {
//     progress.value = withSpring(1, { damping: 10 });
//     return (
//       <View style={styles.container}>
//         <StatusBar style="light" />
//         <LinearGradient
//           colors={['#0A0A0A', '#1A1A1A']}
//           style={styles.background}
//         />
//         <View style={styles.analysisContainer}>
//           <Text style={styles.analysisTitle}>
//             Analyzing {selectedPlatform} profile...
//           </Text>
//           <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
//           <Text style={styles.analysisSubtitle}>This might take a moment</Text>
//           {error ? <Text style={styles.error}>{error}</Text> : null}
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" />
//       <LinearGradient
//         colors={['#0A0A0A', '#1A1A1A']}
//         style={styles.background}
//       />
//       <View style={styles.content}>
//         <Text style={styles.title}>Welcome to Kai</Text>
//         <Text style={styles.subtitle}>Your AI luxury lifestyle assistant</Text>
//         <TextInput
//           placeholder="Enter your username"
//           value={username}
//           onChangeText={setUsername}
//           placeholderTextColor="#999"
//           style={styles.input}
//         />
//         <Text style={styles.subtitle}>Select a platform to analyze:</Text>
//         {socialPlatforms.map((platform) => (
//           <TouchableOpacity
//             key={platform.name}
//             style={[styles.platformButton, { borderColor: platform.color }]}
//             onPress={() => handleSocialLogin(platform.value)}
//           >
//             <platform.icon
//               size={20}
//               color={platform.color}
//               style={{ marginRight: 10 }}
//             />
//             <Text style={styles.buttonText}>{platform.name}</Text>
//           </TouchableOpacity>
//         ))}
//         {error ? <Text style={styles.error}>{error}</Text> : null}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   background: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     left: 0,
//     right: 0,
//   },
//   content: {
//     paddingTop: 100,
//     paddingHorizontal: 20,
//   },
//   title: {
//     fontSize: 28,
//     color: '#FFF',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#CCC',
//     textAlign: 'center',
//     marginBottom: 10,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#555',
//     color: '#FFF',
//     borderRadius: 10,
//     padding: 10,
//     marginVertical: 15,
//   },
//   platformButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 12,
//     borderWidth: 1,
//     borderRadius: 12,
//     marginVertical: 8,
//   },
//   buttonText: {
//     color: '#FFF',
//     fontSize: 16,
//   },
//   error: {
//     color: 'red',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   analysisContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   analysisTitle: {
//     fontSize: 20,
//     color: '#FFF',
//     marginBottom: 16,
//   },
//   progressBar: {
//     height: 6,
//     backgroundColor: '#FFD700',
//     width: '80%',
//     borderRadius: 3,
//     marginBottom: 16,
//   },
//   analysisSubtitle: {
//     color: '#AAA',
//     fontSize: 14,
//   },
// });

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
  const progress = useSharedValue(0);

  useEffect(() => {
    titleScale.value = withDelay(300, withSpring(1, { damping: 15 }));
    subtitleOpacity.value = withDelay(600, withSpring(1));
    socialButtonsOpacity.value = withDelay(900, withSpring(1));
    sparkleRotation.value = withRepeat(
      withSequence(withSpring(360), withSpring(0)),
      -1
    );
  }, []);

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

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const handleSocialLogin = async (platform: string) => {
    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    setSelectedPlatform(platform);
    setIsAnalyzing(true);
    setError('');
    progress.value = withSpring(0.3);

    try {
      const result = await generatePersona(
        platform as 'instagram' | 'twitter' | 'linkedin',
        username.trim()
      );

      progress.value = withSpring(1);

      // Store the persona data
      await AsyncStorage.setItem(
        'personaSummary',
        JSON.stringify(result.summary)
      );
      await AsyncStorage.setItem('personaFullAnalysis', result.full_analysis);
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');

      // Navigate to persona storyboard
      setTimeout(() => {
        return router.replace('/persona-storyboard' as any);
      }, 1000);
    } catch (err) {
      setError('Failed to generate persona. Please try again.');
      setIsAnalyzing(false);
      progress.value = withSpring(0);
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
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <Animated.View
                  style={[styles.progressFill, progressAnimatedStyle]}
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(progress.value * 100)}%
              </Text>
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
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
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
