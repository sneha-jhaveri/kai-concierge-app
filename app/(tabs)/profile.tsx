import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { User, Settings, Bell, Shield, CreditCard, CircleHelp as HelpCircle, LogOut, Crown, Star, ChevronRight, CreditCard as Edit3, Sparkles, Award, Target } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ProfileStat {
  label: string;
  value: string;
  icon: any;
  color: string;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: any;
  type: 'navigation' | 'toggle' | 'action';
  value?: boolean;
  onPress?: () => void;
}

const profileStats: ProfileStat[] = [
  { label: 'Services Used', value: '47', icon: Sparkles, color: '#4ECDC4' },
  { label: 'Satisfaction', value: '98%', icon: Star, color: '#FFD700' },
  { label: 'Premium Days', value: '365', icon: Crown, color: '#FF6B6B' },
  { label: 'AI Interactions', value: '1.2K', icon: Target, color: '#96CEB4' },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [premiumFeatures, setPremiumFeatures] = useState(true);

  const headerOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withDelay(200, withSpring(1));
    cardsOpacity.value = withDelay(400, withSpring(1));
    sparkleRotation.value = withRepeat(
      withSequence(
        withSpring(360, { duration: 8000 }),
        withSpring(0, { duration: 8000 })
      ),
      -1
    );
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const cardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const settingsItems: SettingItem[] = [
    {
      id: '1',
      title: 'Account Settings',
      subtitle: 'Personal information and preferences',
      icon: User,
      type: 'navigation',
      onPress: () => console.log('Account Settings'),
    },
    {
      id: '2',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      icon: Bell,
      type: 'toggle',
      value: notificationsEnabled,
      onPress: () => setNotificationsEnabled(!notificationsEnabled),
    },
    {
      id: '3',
      title: 'Privacy & Security',
      subtitle: 'Control your data and security settings',
      icon: Shield,
      type: 'navigation',
      onPress: () => console.log('Privacy & Security'),
    },
    {
      id: '4',
      title: 'Payment Methods',
      subtitle: 'Manage billing and payment options',
      icon: CreditCard,
      type: 'navigation',
      onPress: () => console.log('Payment Methods'),
    },
    {
      id: '5',
      title: 'Premium Features',
      subtitle: 'Access to exclusive luxury services',
      icon: Crown,
      type: 'toggle',
      value: premiumFeatures,
      onPress: () => setPremiumFeatures(!premiumFeatures),
    },
    {
      id: '6',
      title: 'Help & Support',
      subtitle: '24/7 premium customer support',
      icon: HelpCircle,
      type: 'navigation',
      onPress: () => console.log('Help & Support'),
    },
    {
      id: '7',
      title: 'Sign Out',
      subtitle: 'Log out of your account',
      icon: LogOut,
      type: 'action',
      onPress: () => console.log('Sign Out'),
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  style={styles.avatar}
                />
                <TouchableOpacity style={styles.editButton}>
                  <Edit3 size={16} color="#0A0A0A" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>Alexander Sterling</Text>
                <Text style={styles.userEmail}>alexander@example.com</Text>
                
                <View style={styles.membershipContainer}>
                  <Crown size={16} color="#FFD700" />
                  <Text style={styles.membershipText}>Premium Member</Text>
                  <Animated.View style={sparkleAnimatedStyle}>
                    <Sparkles size={14} color="#FFD700" />
                  </Animated.View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Stats */}
          <Animated.View style={[styles.statsSection, cardsAnimatedStyle]}>
            <Text style={styles.sectionTitle}>Your Activity</Text>
            <View style={styles.statsGrid}>
              {profileStats.map((stat, index) => (
                <TouchableOpacity key={index} style={styles.statCard}>
                  <BlurView intensity={15} style={styles.statBlur}>
                    <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                      <stat.icon size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Achievement Section */}
          <Animated.View style={[styles.achievementSection, cardsAnimatedStyle]}>
            <TouchableOpacity style={styles.achievementCard}>
              <BlurView intensity={20} style={styles.achievementBlur}>
                <View style={styles.achievementContent}>
                  <View style={styles.achievementIcon}>
                    <Award size={24} color="#FFD700" />
                  </View>
                  <View style={styles.achievementText}>
                    <Text style={styles.achievementTitle}>Elite Status Achieved</Text>
                    <Text style={styles.achievementSubtitle}>
                      Unlock exclusive experiences and priority service
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#FFD700" />
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Settings */}
          <Animated.View style={[styles.settingsSection, cardsAnimatedStyle]}>
            <Text style={styles.sectionTitle}>Settings</Text>
            
            {settingsItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.settingItem}
                onPress={item.onPress}
                disabled={item.type === 'toggle'}
              >
                <BlurView intensity={15} style={styles.settingBlur}>
                  <View style={styles.settingContent}>
                    <View style={styles.settingLeft}>
                      <View style={styles.settingIconContainer}>
                        <item.icon size={20} color="#FFD700" />
                      </View>
                      <View style={styles.settingText}>
                        <Text style={styles.settingTitle}>{item.title}</Text>
                        {item.subtitle && (
                          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                        )}
                      </View>
                    </View>
                    
                    <View style={styles.settingRight}>
                      {item.type === 'toggle' ? (
                        <Switch
                          value={item.value}
                          onValueChange={item.onPress}
                          trackColor={{ false: '#333333', true: '#FFD700' }}
                          thumbColor={item.value ? '#FFFFFF' : '#CCCCCC'}
                        />
                      ) : (
                        <ChevronRight size={16} color="#666666" />
                      )}
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </Animated.View>
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
  backgroundGradient: {
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
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 12,
  },
  membershipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  membershipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
    marginHorizontal: 8,
  },
  statsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 56) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  achievementSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  achievementCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  achievementBlur: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  settingsSection: {
    paddingHorizontal: 24,
  },
  settingItem: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  settingRight: {
    marginLeft: 16,
  },
});