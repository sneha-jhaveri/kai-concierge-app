import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Users,
  MessageCircle,
  TrendingUp,
  Settings,
  LogOut,
  BarChart3,
  Activity,
  Shield,
  Database,
  Server,
  Globe,
  Zap,
  Link,
  User,
  ArrowLeft,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  totalMessages: number;
  averageResponseTime: number;
  systemUptime: number;
  errorRate: number;
}

interface SystemStatus {
  status: 'online' | 'offline' | 'maintenance';
  lastUpdate: string;
  version: string;
}

export default function BackendDashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSessions: 0,
    totalMessages: 0,
    averageResponseTime: 0,
    systemUptime: 0,
    errorRate: 0,
  });
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: 'online',
    lastUpdate: new Date().toISOString(),
    version: '1.0.0',
  });
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [personaData, setPersonaData] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [analytics, setAnalytics] = useState<any>({
    totalUsers: 0,
    activeUsers: 0,
    connectedPlatforms: 0,
    personasGenerated: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Get all user data from AsyncStorage
      const allUserData = await AsyncStorage.getItem('allUsers');
      const users = allUserData ? JSON.parse(allUserData) : [];

      // Get current user data
      const userDataRaw = await AsyncStorage.getItem('userData');
      const currentUser = userDataRaw ? JSON.parse(userDataRaw) : {};

      // Add current user if not already in the list
      if (
        currentUser.userId &&
        !users.find((u: any) => u.userId === currentUser.userId)
      ) {
        users.push({
          userId: currentUser.userId,
          email: currentUser.email,
          displayName: currentUser.displayName,
          lastSignIn: new Date().toISOString(),
          platforms: currentUser.usernames || {},
        });
      }

      // Get persona data for each user
      const usersWithData = await Promise.all(
        users.map(async (user: any) => {
          // Try to get persona data for this specific user first
          let personaData = null;
          const personaDataRaw = await AsyncStorage.getItem(
            `personaData_${user.userId}`
          );
          if (personaDataRaw) {
            personaData = JSON.parse(personaDataRaw);
          } else {
            // Fallback to general persona data
            const generalPersonaData = await AsyncStorage.getItem(
              'personaData'
            );
            if (generalPersonaData) {
              personaData = JSON.parse(generalPersonaData);
            }
          }

          // Get social data for this user
          const socialData: Record<string, any> = {};

          // Try user-specific social data first
          for (const platform of ['instagram', 'twitter', 'linkedin']) {
            const socialDataRaw = await AsyncStorage.getItem(
              `socialData_${platform}_${user.userId}`
            );
            if (socialDataRaw) {
              socialData[platform] = JSON.parse(socialDataRaw);
            } else {
              // Fallback to general social data
              const generalSocialData = await AsyncStorage.getItem(
                `socialData_${platform}`
              );
              if (generalSocialData) {
                socialData[platform] = JSON.parse(generalSocialData);
              }
            }
          }

          return {
            ...user,
            personaData,
            socialData,
          };
        })
      );

      setUsers(usersWithData);
      setTotalUsers(usersWithData.length);

      // Calculate analytics
      const connectedPlatforms = usersWithData.reduce(
        (acc: number, user: any) => {
          return acc + Object.keys(user.socialData || {}).length;
        },
        0
      );

      const personasGenerated = usersWithData.filter(
        (user: any) => user.personaData
      ).length;

      setAnalytics({
        totalUsers: usersWithData.length,
        activeUsers: usersWithData.filter((user: any) => {
          const lastSignIn = new Date(user.lastSignIn);
          const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return lastSignIn > oneDayAgo;
        }).length,
        connectedPlatforms,
        personasGenerated,
      });

      console.log('✅ Dashboard data loaded:', {
        users: usersWithData.length,
        connectedPlatforms,
        personasGenerated,
        userData: usersWithData,
      });
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderStatsCard = (
    title: string,
    value: string | number,
    icon: any,
    color: string
  ) => (
    <View style={styles.statsCard}>
      <BlurView intensity={15} style={styles.statsBlur}>
        <View style={styles.statsHeader}>
          {icon}
          <Text style={styles.statsTitle}>{title}</Text>
        </View>
        <Text style={[styles.statsValue, { color }]}>{value}</Text>
      </BlurView>
    </View>
  );

  const renderSystemStatus = () => (
    <View style={styles.statusSection}>
      <BlurView intensity={15} style={styles.statusBlur}>
        <View style={styles.statusHeader}>
          <Server size={24} color="#FFD700" />
          <Text style={styles.statusTitle}>System Status</Text>
        </View>

        <View style={styles.statusGrid}>
          <View style={styles.statusItem}>
            <View
              style={[
                styles.statusIndicator,
                {
                  backgroundColor:
                    systemStatus.status === 'online' ? '#4CAF50' : '#F44336',
                },
              ]}
            />
            <Text style={styles.statusLabel}>Status</Text>
            <Text style={styles.statusValue}>
              {systemStatus.status.toUpperCase()}
            </Text>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Version</Text>
            <Text style={styles.statusValue}>{systemStatus.version}</Text>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Uptime</Text>
            <Text style={styles.statusValue}>{stats.systemUptime}%</Text>
          </View>

          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Error Rate</Text>
            <Text style={styles.statusValue}>{stats.errorRate}%</Text>
          </View>
        </View>
      </BlurView>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.actionsSection}>
      <BlurView intensity={15} style={styles.actionsBlur}>
        <Text style={styles.actionsTitle}>Quick Actions</Text>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'User Management')}
          >
            <Users size={24} color="#FFD700" />
            <Text style={styles.actionText}>Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'Message Analytics')}
          >
            <MessageCircle size={24} color="#FFD700" />
            <Text style={styles.actionText}>Requests</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'System Settings')}
          >
            <Settings size={24} color="#FFD700" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'Database Management')}
          >
            <Database size={24} color="#FFD700" />
            <Text style={styles.actionText}>Database</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading Dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#2d2d2d', '#1a1a1a']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <ArrowLeft size={24} color="#FFD700" />
                </TouchableOpacity>
                <Shield size={32} color="#FFD700" style={{ marginLeft: 12 }} />
                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>Admin Dashboard</Text>
                  <Text style={styles.headerSubtitle}>System Management</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <LogOut size={24} color="#FFD700" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              {renderStatsCard(
                'Total Users',
                analytics.totalUsers.toLocaleString(),
                <Users size={24} color="#4CAF50" />,
                '#4CAF50'
              )}
              {renderStatsCard(
                'Active Users (24h)',
                analytics.activeUsers.toLocaleString(),
                <Activity size={24} color="#2196F3" />,
                '#2196F3'
              )}
              {renderStatsCard(
                'Connected Platforms',
                analytics.connectedPlatforms.toLocaleString(),
                <Link size={24} color="#FF9800" />,
                '#FF9800'
              )}
              {renderStatsCard(
                'Personas Generated',
                analytics.personasGenerated.toLocaleString(),
                <User size={24} color="#9C27B0" />,
                '#9C27B0'
              )}
            </View>

            {/* System Status */}
            {renderSystemStatus()}

            {/* Quick Actions */}
            {renderQuickActions()}

            {/* Recent Activity */}
            <View style={styles.activitySection}>
              <BlurView intensity={15} style={styles.activityBlur}>
                <Text style={styles.activityTitle}>Recent Activity</Text>

                <View style={styles.activityList}>
                  {userData?.usernames?.instagram && (
                    <View style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <Users size={16} color="#4CAF50" />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>
                          Instagram connected: @{userData.usernames.instagram}
                        </Text>
                        <Text style={styles.activityTime}>Recently</Text>
                      </View>
                    </View>
                  )}

                  {userData?.usernames?.twitter && (
                    <View style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <MessageCircle size={16} color="#2196F3" />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>
                          Twitter connected: @{userData.usernames.twitter}
                        </Text>
                        <Text style={styles.activityTime}>Recently</Text>
                      </View>
                    </View>
                  )}

                  {personaData?.title && (
                    <View style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <TrendingUp size={16} color="#FF9800" />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>
                          Persona generated: {personaData.title}
                        </Text>
                        <Text style={styles.activityTime}>Recently</Text>
                      </View>
                    </View>
                  )}

                  {chatHistory.length > 0 && (
                    <View style={styles.activityItem}>
                      <View style={styles.activityIcon}>
                        <MessageCircle size={16} color="#9C27B0" />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityText}>
                          {chatHistory.length} messages in chat history
                        </Text>
                        <Text style={styles.activityTime}>Recently</Text>
                      </View>
                    </View>
                  )}
                </View>
              </BlurView>
            </View>

            {/* Users List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Users</Text>
              <ScrollView style={styles.usersList}>
                {users.map((user, index) => (
                  <View key={user.userId} style={styles.userCard}>
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>
                        {user.displayName || user.email}
                      </Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                      <Text style={styles.userDate}>
                        Last active:{' '}
                        {new Date(user.lastSignIn).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.userStats}>
                      <Text style={styles.userStat}>
                        Platforms: {Object.keys(user.socialData || {}).length}
                      </Text>
                      <Text style={styles.userStat}>
                        Persona:{' '}
                        {user.personaData ? 'Generated' : 'Not generated'}
                      </Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statsCard: {
    width: (width - 48) / 2 - 8,
    marginBottom: 16,
  },
  statsBlur: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginLeft: 8,
  },
  statsValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  statusSection: {
    marginBottom: 24,
  },
  statusBlur: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginLeft: 8,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusItem: {
    width: '50%',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  statusValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
  },
  actionsSection: {
    marginBottom: 24,
  },
  actionsBlur: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  actionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actionButton: {
    width: (width - 48) / 4 - 8,
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginTop: 4,
    textAlign: 'center',
  },
  activitySection: {
    marginBottom: 24,
  },
  activityBlur: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 16,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 16,
  },
  usersList: {
    gap: 12,
  },
  userCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 4,
  },
  userDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  userStats: {
    alignItems: 'flex-end',
  },
  userStat: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 2,
  },
});
