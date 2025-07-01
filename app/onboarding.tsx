// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   Platform,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { BlurView } from 'expo-blur';
// import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withSpring,
//   withDelay,
//   withSequence,
//   withRepeat,
// } from 'react-native-reanimated';
// import { Sparkles, Bot, Star, Crown, Instagram, Twitter, Linkedin } from 'lucide-react-native';

// const { width, height } = Dimensions.get('window');

// const socialPlatforms = [
//   { 
//     name: 'Instagram', 
//     icon: Instagram, 
//     color: '#E4405F',
//     description: 'Analyze your lifestyle preferences',
//   },
//   { 
//     name: 'X (Twitter)', 
//     icon: Twitter, 
//     color: '#1DA1F2',
//     description: 'Understand your interests and network',
//   },
//   { 
//     name: 'LinkedIn', 
//     icon: Linkedin, 
//     color: '#0077B5',
//     description: 'Professional insights and preferences',
//   },
//   { 
//     name: 'Google', 
//     icon: Star, 
//     color: '#4285F4',
//     description: 'Complete digital profile analysis',
//   },
// ];

// const analysisSteps = [
//   'Connecting to your profile...',
//   'Analyzing your interests...',
//   'Understanding your lifestyle...',
//   'Identifying preferences...',
//   'Creating your AI profile...',
//   'Preparing personalized experience...',
// ];

// export default function OnboardingScreen() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [analysisStep, setAnalysisStep] = useState(0);

//   const titleScale = useSharedValue(0);
//   const subtitleOpacity = useSharedValue(0);
//   const socialButtonsOpacity = useSharedValue(0);
//   const sparkleRotation = useSharedValue(0);
//   const analysisProgress = useSharedValue(0);

//   useEffect(() => {
//     titleScale.value = withDelay(300, withSpring(1, { damping: 15 }));
//     subtitleOpacity.value = withDelay(600, withSpring(1));
//     socialButtonsOpacity.value = withDelay(900, withSpring(1));
//     sparkleRotation.value = withRepeat(
//       withSequence(
//         withSpring(360, { duration: 4000 }),
//         withSpring(0, { duration: 4000 })
//       ),
//       -1
//     );
//   }, []);

//   useEffect(() => {
//     if (isAnalyzing) {
//       const interval = setInterval(() => {
//         setAnalysisStep((prev) => {
//           if (prev < analysisSteps.length - 1) {
//             analysisProgress.value = withSpring((prev + 1) / analysisSteps.length);
//             return prev + 1;
//           } else {
//             clearInterval(interval);
//             setTimeout(() => {
//               router.replace('/(tabs)');
//             }, 1000);
//             return prev;
//           }
//         });
//       }, 1500);

//       return () => clearInterval(interval);
//     }
//   }, [isAnalyzing]);

//   const titleAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ scale: titleScale.value }],
//   }));

//   const subtitleAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: subtitleOpacity.value,
//   }));

//   const socialAnimatedStyle = useAnimatedStyle(() => ({
//     opacity: socialButtonsOpacity.value,
//   }));

//   const sparkleAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ rotate: `${sparkleRotation.value}deg` }],
//   }));

//   const progressAnimatedStyle = useAnimatedStyle(() => ({
//     width: `${analysisProgress.value * 100}%`,
//   }));

//   const handleSocialLogin = (platform: string) => {
//     setSelectedPlatform(platform);
//     setIsAnalyzing(true);
//     setAnalysisStep(0);
//     analysisProgress.value = 0;
//   };

//   if (isAnalyzing) {
//     return (
//       <View style={styles.container}>
//         <StatusBar style="light" />

//         <LinearGradient
//           colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
//           style={styles.backgroundGradient}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         />

//         <View style={styles.analysisContainer}>
//           <View style={styles.analysisContent}>
//             <View style={styles.aiIconContainer}>
//               <LinearGradient
//                 colors={['#FFD700', '#FFA500', '#FFD700']}
//                 style={styles.aiIconGradient}
//               >
//                 <Bot size={48} color="#0A0A0A" />
//               </LinearGradient>
//             </View>

//             <Text style={styles.analysisTitle}>AI Profile Analysis</Text>
//             <Text style={styles.analysisSubtitle}>
//               Kai is analyzing your {selectedPlatform} profile to create your
//               personalized experience
//             </Text>

//             <View style={styles.progressContainer}>
//               <View style={styles.progressBar}>
//                 <Animated.View
//                   style={[styles.progressFill, progressAnimatedStyle]}
//                 />
//               </View>
//               <Text style={styles.progressText}>
//                 {Math.round((analysisStep / analysisSteps.length) * 100)}%
//               </Text>
//             </View>

//             <Text style={styles.currentStep}>
//               {analysisSteps[analysisStep]}
//             </Text>

//             <View style={styles.analysisFeatures}>
//               <View style={styles.featureItem}>
//                 <Sparkles size={16} color="#FFD700" />
//                 <Text style={styles.featureItem}>
//                   Learning your preferences
//                 </Text>
//               </View>
//               <View style={styles.featureItem}>
//                 <Crown size={16} color="#FFD700" />
//                 <Text style={styles.featureItem}>
//                   Personalizing luxury services
//                 </Text>
//               </View>
//               <View style={styles.featureItem}>
//                 <Star size={16} color="#FFD700" />
//                 <Text style={styles.featureItem}>
//                   Optimizing your experience
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar style="light" />
      
//       {/* Background Gradient */}
//       <LinearGradient
//         colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
//         style={styles.backgroundGradient}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//       />

//       {/* Floating Elements */}
//       <Animated.View style={[styles.floatingElement, { top: 100, left: 50 }, sparkleAnimatedStyle]}>
//         <Sparkles size={20} color="#FFD700" />
//       </Animated.View>
//       <Animated.View style={[styles.floatingElement, { top: 200, right: 80 }, sparkleAnimatedStyle]}>
//         <Star size={16} color="#FFD700" />
//       </Animated.View>
//       <Animated.View style={[styles.floatingElement, { bottom: 300, left: 30 }, sparkleAnimatedStyle]}>
//         <Crown size={18} color="#FFD700" />
//       </Animated.View>

//       <View style={styles.content}>
//         {/* Header */}
//         <View style={styles.header}>
//           <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
//             <Text style={styles.title}>Kai</Text>
//             <Text style={styles.titleAccent}>Concierge</Text>
//           </Animated.View>
          
//           <Animated.View style={subtitleAnimatedStyle}>
//             <Text style={styles.subtitle}>
//               Your personal AI assistant for luxury living
//             </Text>
//             <Text style={styles.description}>
//               Connect your social profiles to unlock personalized recommendations and seamless service
//             </Text>
//           </Animated.View>
//         </View>

//         {/* AI Icon */}
//         <View style={styles.aiIconContainer}>
//           <LinearGradient
//             colors={['#FFD700', '#FFA500', '#FFD700']}
//             style={styles.aiIconGradient}
//           >
//             <Bot size={40} color="#0A0A0A" />
//           </LinearGradient>
//         </View>

//         {/* Social Login Options */}
//         <Animated.View style={[styles.socialContainer, socialAnimatedStyle]}>
//           <Text style={styles.socialTitle}>Choose your preferred platform</Text>
          
//           {socialPlatforms.map((platform, index) => (
//             <TouchableOpacity
//               key={platform.name}
//               style={styles.socialButton}
//               onPress={() => handleSocialLogin(platform.name)}
//               disabled={selectedPlatform !== null}
//             >
//               <BlurView intensity={20} style={styles.socialButtonBlur}>
//                 <View style={[styles.socialIconContainer, { backgroundColor: platform.color }]}>
//                   <platform.icon size={20} color="#FFFFFF" />
//                 </View>
//                 <View style={styles.socialTextContainer}>
//                   <Text style={styles.socialText}>Connect with {platform.name}</Text>
//                   <Text style={styles.socialDescription}>{platform.description}</Text>
//                 </View>
//                 <View style={styles.securityBadge}>
//                   <Text style={styles.securityText}>Secure</Text>
//                 </View>
//               </BlurView>
//             </TouchableOpacity>
//           ))}
//         </Animated.View>

//         {/* Features Preview */}
//         <View style={styles.featuresContainer}>
//           <Text style={styles.featuresTitle}>What Kai will learn about you</Text>
//           <View style={styles.featuresList}>
//             <Text style={styles.featureItem}>✨ Lifestyle preferences and interests</Text>
//             <Text style={styles.featureItem}>🏖️ Travel destinations and accommodation tastes</Text>
//             <Text style={styles.featureItem}>🛍️ Fashion style and shopping preferences</Text>
//             <Text style={styles.featureItem}>🍷 Dining habits and culinary interests</Text>
//             <Text style={styles.featureItem}>💼 Professional needs and networking</Text>
//           </View>
//         </View>
//       </View>
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
//   floatingElement: {
//     position: 'absolute',
//     opacity: 0.6,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 80,
//     justifyContent: 'space-between',
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 48,
//     fontFamily: 'Playfair-Bold',
//     color: '#FFFFFF',
//     marginRight: 8,
//   },
//   titleAccent: {
//     fontSize: 48,
//     fontFamily: 'Playfair-Bold',
//     color: '#FFD700',
//   },
//   subtitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#CCCCCC',
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 12,
//   },
//   description: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#999999',
//     textAlign: 'center',
//     lineHeight: 20,
//   },
//   aiIconContainer: {
//     alignItems: 'center',
//     marginVertical: 40,
//   },
//   aiIconGradient: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#FFD700',
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.5,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   socialContainer: {
//     flex: 1,
//     justifyContent: 'center',
//   },
//   socialTitle: {
//     fontSize: 18,
//     fontFamily: 'Inter-Medium',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   socialButton: {
//     marginBottom: 16,
//     borderRadius: 16,
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 215, 0, 0.2)',
//   },
//   socialButtonBlur: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 18,
//     paddingHorizontal: 20,
//     backgroundColor: 'rgba(255, 255, 255, 0.05)',
//   },
//   socialIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   socialTextContainer: {
//     flex: 1,
//   },
//   socialText: {
//     fontSize: 16,
//     fontFamily: 'Inter-Medium',
//     color: '#FFFFFF',
//     marginBottom: 4,
//   },
//   socialDescription: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//     color: '#CCCCCC',
//   },
//   securityBadge: {
//     backgroundColor: 'rgba(76, 175, 80, 0.2)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: 'rgba(76, 175, 80, 0.4)',
//   },
//   securityText: {
//     fontSize: 10,
//     fontFamily: 'Inter-Medium',
//     color: '#4CAF50',
//   },
//   featuresContainer: {
//     marginBottom: 40,
//   },
//   featuresTitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     color: '#FFD700',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   featuresList: {
//     alignItems: 'center',
//   },
//   featureItem: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     color: '#CCCCCC',
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   // Analysis Screen Styles
//   analysisContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//   },
//   analysisContent: {
//     alignItems: 'center',
//     width: '100%',
//   },
//   analysisTitle: {
//     fontSize: 24,
//     fontFamily: 'Playfair-Bold',
//     color: '#FFFFFF',
//     marginTop: 24,
//     marginBottom: 8,
//   },
//   analysisSubtitle: {
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//     color: '#CCCCCC',
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 40,
//   },
//   progressContainer: {
//     width: '100%',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   progressBar: {
//     width: '100%',
//     height: 6,
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: 3,
//     overflow: 'hidden',
//     marginBottom: 12,
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#FFD700',
//     borderRadius: 3,
//   },
//   progressText: {
//     fontSize: 14,
//     fontFamily: 'Inter-Medium',
//     color: '#FFD700',
//   },
//   currentStep: {
//     fontSize: 16,
//     fontFamily: 'Inter-Medium',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   analysisFeatures: {
//     alignItems: 'center',
//   },
// });


import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
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

const { width, height } = Dimensions.get('window');

const socialPlatforms = [
  {
    name: 'Instagram',
    icon: Instagram,
    color: '#E4405F',
    description: 'Analyze your lifestyle preferences',
  },
  {
    name: 'X (Twitter)',
    icon: Twitter,
    color: '#1DA1F2',
    description: 'Understand your interests and network',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: '#0077B5',
    description: 'Professional insights and preferences',
  },
  {
    name: 'Google',
    icon: Star,
    color: '#4285F4',
    description: 'Complete digital profile analysis',
  },
];

const analysisSteps = [
  'Connecting to your profile...',
  'Analyzing your interests...',
  'Understanding your lifestyle...',
  'Identifying preferences...',
  'Creating your AI profile...',
  'Preparing personalized experience...',
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const titleScale = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const socialButtonsOpacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  const analysisProgress = useSharedValue(0);

  useEffect(() => {
    titleScale.value = withDelay(300, withSpring(1, { damping: 12 }));
    subtitleOpacity.value = withDelay(600, withSpring(1));
    socialButtonsOpacity.value = withDelay(900, withSpring(1));
    sparkleRotation.value = withRepeat(
      withSequence(withSpring(360, { duration: 5000 }), withSpring(0)),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (isAnalyzing) {
      const interval = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev < analysisSteps.length - 1) {
            analysisProgress.value = withSpring(
              (prev + 1) / analysisSteps.length
            );
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(async () => {
              await AsyncStorage.setItem('hasCompletedOnboarding', 'true'); // Mark onboarding as complete
              router.replace('/(tabs)');
            }, 1000);
            return prev;
          }
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [isAnalyzing]);

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
    width: `${analysisProgress.value * 100}%`,
  }));

  const handleSocialLogin = (platform: string) => {
    setSelectedPlatform(platform);
    setIsAnalyzing(true);
    setAnalysisStep(0);
    analysisProgress.value = 0;
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
        <View style={styles.analysisContainer}>
          <View style={styles.analysisContent}>
            <View style={styles.aiIconContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FFD700']}
                style={styles.aiIconGradient}
              >
                <Bot size={60} color="#0A0A0A" />
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
                {Math.round((analysisStep / analysisSteps.length) * 100)}%
              </Text>
            </View>
            <Text style={styles.currentStep}>
              {analysisSteps[analysisStep]}
            </Text>
            <View style={styles.analysisFeatures}>
              <View style={styles.featureItem}>
                <Sparkles
                  size={20}
                  color="#FFD700"
                  style={styles.featureIcon}
                />
                <Text style={styles.featureText}>
                  Learning your preferences
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Crown size={20} color="#FFD700" style={styles.featureIcon} />
                <Text style={styles.featureText}>
                  Personalizing luxury services
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Star size={20} color="#FFD700" style={styles.featureIcon} />
                <Text style={styles.featureText}>
                  Optimizing your experience
                </Text>
              </View>
            </View>
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
      <View style={styles.contentWrapper}>
        <Animated.View
          style={[
            styles.floatingElement,
            { top: height * 0.05, left: width * 0.05 },
            sparkleAnimatedStyle,
          ]}
        >
          <Sparkles size={24} color="#FFD700" />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingElement,
            { top: height * 0.25, right: width * 0.15 },
            sparkleAnimatedStyle,
          ]}
        >
          <Star size={20} color="#FFD700" />
        </Animated.View>
        <Animated.View
          style={[
            styles.floatingElement,
            { bottom: height * 0.25, left: width * 0.05 },
            sparkleAnimatedStyle,
          ]}
        >
          <Crown size={22} color="#FFD700" />
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
            <Text style={styles.socialTitle}>
              Choose your preferred platform
            </Text>
            <View style={styles.socialButtons}>
              {socialPlatforms.map((platform, index) => (
                <TouchableOpacity
                  key={platform.name}
                  style={styles.socialButton}
                  onPress={() => handleSocialLogin(platform.name)}
                  disabled={selectedPlatform !== null}
                  activeOpacity={0.7}
                >
                  <BlurView intensity={30} style={styles.socialButtonBlur}>
                    <View
                      style={[
                        styles.socialIconContainer,
                        { backgroundColor: platform.color },
                      ]}
                    >
                      <platform.icon size={24} color="#FFFFFF" />
                    </View>
                    <View style={styles.socialTextContainer}>
                      <Text style={styles.socialText}>
                        Connect with {platform.name}
                      </Text>
                      <Text style={styles.socialDescription}>
                        {platform.description}
                      </Text>
                    </View>
                    <View style={styles.securityBadge}>
                      <Text style={styles.securityText}>Secure</Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  contentWrapper: {
    flex: 1,
    position: 'relative',
    zIndex: 2,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingElement: {
    position: 'absolute',
    opacity: 0.7,
    zIndex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: height * 0.1,
    paddingBottom: 20,
    justifyContent: 'space-between',
    zIndex: 3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  title: {
    fontSize: 52,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginRight: 6,
  },
  titleAccent: {
    fontSize: 52,
    fontFamily: 'Playfair-Bold',
    color: '#FFD700',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#DDDDDD',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#AAAAAA',
    textAlign: 'center',
    lineHeight: 22,
  },
  aiIconContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  aiIconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 12,
  },
  socialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  socialButtons: {
    width: '100%',
    maxWidth: 400,
  },
  socialButton: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  socialButtonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  socialIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  socialTextContainer: {
    flex: 1,
  },
  socialText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  socialDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  securityBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.5)',
  },
  securityText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#4CAF50',
  },
  featuresContainer: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 12,
  },
  featuresList: {
    alignItems: 'center',
  },
  featureItem: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 10,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  analysisContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 3,
  },
  analysisContent: {
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  analysisTitle: {
    fontSize: 28,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginTop: 30,
    marginBottom: 12,
  },
  analysisSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#DDDDDD',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
  },
  currentStep: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  analysisFeatures: {
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
});
