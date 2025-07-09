import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  User,
  Settings,
  LogOut,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Star,
  Activity,
  TrendingUp,
  Shield,
  ArrowRight,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../hooks/firebaseConfig';

const { width, height } = Dimensions.get('window');

interface UserData {
  email?: string;
  displayName?: string;
  photoURL?: string;
  usernames?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface PersonaData {
  title?: string;
  summary?: {
    key_insights: string[];
    demographics: string;
    personality: string;
    interests: string;
    shopping: string;
    recommendations: string;
  };
}

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u === null) {
        router.replace('/sign-in');
      } else {
        await loadUserData();
      }
    });
    return unsubscribe;
  }, []);

  const loadUserData = async () => {
    try {
      // Load user data from AsyncStorage
      const userDataRaw = await AsyncStorage.getItem('userData');
      const userDataParsed = userDataRaw ? JSON.parse(userDataRaw) : {};
      setUserData(userDataParsed);

      // Load persona data
      const personaDataRaw = await AsyncStorage.getItem('personaData');
      const personaDataParsed = personaDataRaw
        ? JSON.parse(personaDataRaw)
        : null;
      setPersonaData(personaDataParsed);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.clear();
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    // Navigate to edit profile screen or show modal
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const getConnectedPlatforms = () => {
    const platforms = [];
    if (userData?.usernames?.instagram) platforms.push('Instagram');
    if (userData?.usernames?.twitter) platforms.push('Twitter');
    if (userData?.usernames?.linkedin) platforms.push('LinkedIn');
    return platforms;
  };

  const getPersonaSummary = () => {
    if (!personaData?.summary) return 'No persona summary available';

    const {
      key_insights,
      demographics,
      personality,
      interests,
      shopping,
      recommendations,
    } = personaData.summary;

    return (
      `Key Insights:\n- ${key_insights.join('\n- ')}\n\n` +
      `Demographics: ${demographics}\n\n` +
      `Personality: ${personality}\n\n` +
      `Interests: ${interests}\n\n` +
      `Shopping: ${shopping}\n\n` +
      `Recommendations: ${recommendations}`
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A']}
        style={styles.background}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.profileImage}
              >
                <User size={40} color="#0A0A0A" />
              </LinearGradient>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {userData?.displayName || user?.displayName || 'User'}
              </Text>
              <Text style={styles.email}>{user?.email}</Text>
              <Text style={styles.memberSince}>
                Member since {new Date().getFullYear()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditProfile}
            >
              <Edit3 size={20} color="#FFD700" />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <BlurView intensity={15} style={styles.statCard}>
              <Activity size={24} color="#FFD700" />
              <Text style={styles.statValue}>
                {getConnectedPlatforms().length}
              </Text>
              <Text style={styles.statLabel}>Connected Platforms</Text>
            </BlurView>
            <BlurView intensity={15} style={styles.statCard}>
              <TrendingUp size={24} color="#FFD700" />
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Profile Complete</Text>
            </BlurView>
            <BlurView intensity={15} style={styles.statCard}>
              <Star size={24} color="#FFD700" />
              <Text style={styles.statValue}>Gold</Text>
              <Text style={styles.statLabel}>Membership</Text>
            </BlurView>
          </View>

          {/* Connected Platforms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connected Platforms</Text>
            <View style={styles.platformsContainer}>
              {getConnectedPlatforms().map((platform, index) => (
                <BlurView
                  key={index}
                  intensity={15}
                  style={styles.platformCard}
                >
                  <Text style={styles.platformName}>{platform}</Text>
                  <Text style={styles.platformStatus}>Connected</Text>
                </BlurView>
              ))}
              {getConnectedPlatforms().length === 0 && (
                <Text style={styles.noPlatforms}>
                  No platforms connected yet. Complete onboarding to connect
                  your social media accounts.
                </Text>
              )}
            </View>
          </View>

          {/* Persona Summary */}
          {personaData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Persona Summary</Text>
              <BlurView intensity={15} style={styles.personaCard}>
                <Text style={styles.personaTitle}>
                  {personaData.title || 'Your Personal Concierge Profile'}
                </Text>
                <Text style={styles.personaContent}>{getPersonaSummary()}</Text>
                <TouchableOpacity
                  style={styles.viewFullButton}
                  onPress={() => router.push('/persona')}
                >
                  <Text style={styles.viewFullButtonText}>
                    View Full Analysis
                  </Text>
                </TouchableOpacity>
              </BlurView>
            </View>
          )}

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsContainer}>
              <TouchableOpacity style={styles.settingItem}>
                <Settings size={20} color="#FFD700" />
                <Text style={styles.settingText}>Preferences</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Mail size={20} color="#FFD700" />
                <Text style={styles.settingText}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingItem}>
                <Award size={20} color="#FFD700" />
                <Text style={styles.settingText}>Membership</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Admin Dashboard */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/backend-dashboard')}
          >
            <View style={styles.menuIcon}>
              <Shield size={24} color="#FFD700" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Admin Dashboard</Text>
              <Text style={styles.menuSubtitle}>System management</Text>
            </View>
            <ArrowRight size={20} color="#CCCCCC" />
          </TouchableOpacity>

          {/* Sign Out */}
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <LogOut size={20} color="#FF6B6B" />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    paddingBottom: 16,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
  },
  editButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  platformsContainer: {
    gap: 12,
  },
  platformCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  platformName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  platformStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#00FF88',
  },
  noPlatforms: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  personaCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  personaTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 8,
  },
  personaContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 16,
  },
  viewFullButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  viewFullButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
  },
  settingsContainer: {
    gap: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  signOutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 16,
  },
  menuIcon: {
    marginRight: 16,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
});
