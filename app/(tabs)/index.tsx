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
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import {
  Bell,
  Sparkles,
  MapPin,
  ShoppingBag,
  Calendar,
  TrendingUp,
  Crown,
  Star,
  ChevronRight,
  Bot,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const quickActions = [
  { id: 1, title: 'Book Travel', icon: MapPin, color: '#FF6B6B' },
  { id: 2, title: 'Personal Shopping', icon: ShoppingBag, color: '#4ECDC4' },
  { id: 3, title: 'Schedule Management', icon: Calendar, color: '#45B7D1' },
  { id: 4, title: 'Lifestyle Optimization', icon: TrendingUp, color: '#96CEB4' },
];

const recentActivities = [
  {
    id: 1,
    title: 'Luxury Spa Weekend',
    subtitle: 'Booked for next Friday',
    status: 'Confirmed',
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'Fine Dining Reservation',
    subtitle: 'Table for 2 at Le Bernardin',
    status: 'Pending',
    image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'Personal Shopper',
    subtitle: 'Wardrobe consultation',
    status: 'In Progress',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function DashboardScreen() {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const headerOpacity = useSharedValue(0);
  const cardsOpacity = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withDelay(200, withSpring(1));
    cardsOpacity.value = withDelay(400, withSpring(1));
    sparkleRotation.value = withRepeat(
      withSequence(
        withSpring(360, { duration: 6000 }),
        withSpring(0, { duration: 6000 })
      ),
      -1
    );

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

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
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>{getGreeting()}</Text>
                <Text style={styles.userName}>Alexander</Text>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={24} color="#FFD700" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.aiAssistantCard}>
              <BlurView intensity={20} style={styles.aiAssistantBlur}>
                <View style={styles.aiAssistantContent}>
                  <View style={styles.aiIconContainer}>
                    <Animated.View style={sparkleAnimatedStyle}>
                      <Bot size={24} color="#0A0A0A" />
                    </Animated.View>
                  </View>
                  <View style={styles.aiTextContainer}>
                    <Text style={styles.aiTitle}>Kai is ready to assist</Text>
                    <Text style={styles.aiSubtitle}>What can I help you with today?</Text>
                  </View>
                  <ChevronRight size={20} color="#FFD700" />
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={[styles.section, cardsAnimatedStyle]}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={action.id}
                  style={styles.quickActionCard}
                >
                  <BlurView intensity={15} style={styles.quickActionBlur}>
                    <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                      <action.icon size={24} color="#FFFFFF" />
                    </View>
                    <Text style={styles.quickActionText}>{action.title}</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Recent Activities */}
          <Animated.View style={[styles.section, cardsAnimatedStyle]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {recentActivities.map((activity, index) => (
              <TouchableOpacity key={activity.id} style={styles.activityCard}>
                <BlurView intensity={15} style={styles.activityBlur}>
                  <Image source={{ uri: activity.image }} style={styles.activityImage} />
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
                    <View style={styles.activityStatus}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: activity.status === 'Confirmed' ? '#4CAF50' : 
                                           activity.status === 'Pending' ? '#FFC107' : '#2196F3' }
                      ]} />
                      <Text style={styles.statusText}>{activity.status}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color="#666666" />
                </BlurView>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Insights */}
          <Animated.View style={[styles.section, cardsAnimatedStyle]}>
            <Text style={styles.sectionTitle}>Your Insights</Text>
            <View style={styles.insightsContainer}>
              <TouchableOpacity style={styles.insightCard}>
                <BlurView intensity={15} style={styles.insightBlur}>
                  <Crown size={24} color="#FFD700" />
                  <Text style={styles.insightTitle}>Premium Member</Text>
                  <Text style={styles.insightSubtitle}>Unlock exclusive experiences</Text>
                </BlurView>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.insightCard}>
                <BlurView intensity={15} style={styles.insightBlur}>
                  <Star size={24} color="#FFD700" />
                  <Text style={styles.insightTitle}>5-Star Rating</Text>
                  <Text style={styles.insightSubtitle}>From your recent services</Text>
                </BlurView>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  aiAssistantCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  aiAssistantBlur: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  aiAssistantContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  aiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  aiTextContainer: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  aiSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 56) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickActionBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  activityImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 8,
  },
  activityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#CCCCCC',
  },
  insightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  insightCard: {
    width: (width - 56) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  insightBlur: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 20,
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
  },
  insightSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginTop: 4,
    textAlign: 'center',
  },
});