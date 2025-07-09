import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import {
  Instagram,
  Twitter,
  Linkedin,
  Edit3,
  Save,
  X,
  User,
  BarChart3,
  TrendingUp,
  MessageCircle,
  Hash,
  Calendar,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../hooks/firebaseConfig';

const { width, height } = Dimensions.get('window');

type Platform = 'instagram' | 'twitter' | 'linkedin';

interface PlatformData {
  connected: boolean;
  username: string;
  data: any;
  analysis: any;
}

export default function PersonaAnalysisScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Platform>('instagram');
  const [platformData, setPlatformData] = useState<
    Record<Platform, PlatformData>
  >({
    instagram: { connected: false, username: '', data: null, analysis: null },
    twitter: { connected: false, username: '', data: null, analysis: null },
    linkedin: { connected: false, username: '', data: null, analysis: null },
  });
  const [isEditing, setIsEditing] = useState<Platform | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [storyboardData, setStoryboardData] = useState<any>(null);
  const [inlineEditing, setInlineEditing] = useState<Platform | null>(null);
  const [inlineEditData, setInlineEditData] = useState<any>(null);

  const tabScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);

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

  useEffect(() => {
    loadStoryboardData();
  }, []);

  const loadPersonaData = async () => {
    try {
      console.log('🔄 Loading persona data...');

      // Load user data
      const userDataRaw = await AsyncStorage.getItem('userData');
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      console.log('📱 User data loaded:', userData);

      // Load persona data
      const personaDataRaw = await AsyncStorage.getItem('personaData');
      const personaData = personaDataRaw ? JSON.parse(personaDataRaw) : {};
      console.log('🎭 Persona data loaded:', personaData);

      // Load social data for each platform
      const newPlatformData = { ...platformData };

      for (const platform of [
        'instagram',
        'twitter',
        'linkedin',
      ] as Platform[]) {
        const socialDataRaw = await AsyncStorage.getItem(
          `socialData_${platform}`
        );
        const socialData = socialDataRaw ? JSON.parse(socialDataRaw) : null;
        console.log(`📊 ${platform} data:`, socialData ? 'Found' : 'Not found');
        if (socialData) {
          console.log(
            `📊 ${platform} data content:`,
            JSON.stringify(socialData).substring(0, 200) + '...'
          );
        }

        // Find persona section for this platform
        let personaSection = null;
        if (personaData.sections) {
          personaSection = personaData.sections.find((s: any) =>
            s.heading.toLowerCase().includes(platform)
          );
        }

        // Only show as connected if we have actual data
        const isConnected = !!socialData && !!userData.usernames?.[platform];

        newPlatformData[platform] = {
          connected: isConnected,
          username: userData.usernames?.[platform] || '',
          data: socialData,
          analysis: personaSection || null,
        };

        // Add mock data for testing if no real data but user has username
        if (!socialData && userData.usernames?.[platform] && !personaSection) {
          console.log(`🎭 Adding mock data for ${platform}`);
          newPlatformData[platform] = {
            connected: true, // Show as connected for testing
            username: userData.usernames[platform],
            data: { mock: true },
            analysis: {
              heading: `${
                platform.charAt(0).toUpperCase() + platform.slice(1)
              } Analysis`,
              content: `This is mock analysis data for ${platform}. In a real scenario, this would contain actual analysis based on your social media data.`,
            },
          };
        }
      }

      console.log('✅ Final platform data:', newPlatformData);
      setPlatformData(newPlatformData);
    } catch (error) {
      console.error('❌ Error loading persona data:', error);
    }
  };

  const loadStoryboardData = async () => {
    try {
      const personaDataRaw = await AsyncStorage.getItem('personaData');
      if (personaDataRaw) {
        const personaData = JSON.parse(personaDataRaw);
        setStoryboardData(personaData);
      }
    } catch (error) {
      console.error('Error loading storyboard data:', error);
    }
  };

  const handleEdit = (platform: Platform, sectionType?: string) => {
    const currentData = platformData[platform];

    if (sectionType) {
      // Edit specific section content - get existing content
      let existingContent = '';
      if (platform === 'instagram') {
        if (sectionType === 'content') {
          existingContent =
            '• Content Types: Primarily image posts (GraphSidecar and GraphImage)\n• Engagement: High engagement on posts, with likes ranging from 149 to 249\n• Captions: Casual and humorous tone, often using emojis\n• Hashtags: Limited use, indicating focus on personal branding';
        } else if (sectionType === 'behavioral') {
          existingContent =
            '• Posting Frequency: Infrequent posting with 5 total posts\n• Engagement Style: Actively engages with followers through comments\n• Content Themes: Lifestyle and personal moments, Web3 trader identity';
        } else if (sectionType === 'recommendations') {
          existingContent =
            '• Increase posting frequency to maintain engagement\n• Share more Web3 and NFT insights to attract niche audience\n• Utilize stories and polls for interactive engagement\n• Explore partnerships with tech and lifestyle brands';
        }
      } else if (platform === 'twitter') {
        if (sectionType === 'content') {
          existingContent =
            '• Content Types: Mix of text tweets, quote tweets, and media posts\n• Engagement: Strong engagement on tech and Web3 related content\n• Tone: Professional yet approachable, often sharing insights\n• Hashtags: Strategic use of #Web3, #NFT, #Tech hashtags';
        } else if (sectionType === 'behavioral') {
          existingContent =
            '• Posting Frequency: Active daily engagement with 342 total tweets\n• Engagement Style: Responds to mentions and participates in discussions\n• Content Themes: Tech insights, Web3 updates, personal thoughts';
        } else if (sectionType === 'recommendations') {
          existingContent =
            '• Continue sharing valuable tech insights to maintain authority\n• Engage more with Web3 community discussions\n• Consider creating Twitter threads for complex topics\n• Leverage Twitter Spaces for community building';
        }
      } else if (platform === 'linkedin') {
        if (sectionType === 'profile') {
          existingContent =
            '• Industry: Technology and Web3 Development\n• Experience: 5+ years in software development and blockchain\n• Skills: React Native, Blockchain, AI/ML, Full-Stack Development\n• Education: Computer Science background with ongoing learning';
        } else if (sectionType === 'strategy') {
          existingContent =
            '• Posts: Shares technical insights and industry updates\n• Engagement: Actively comments on industry posts and articles\n• Networking: Participates in tech groups and discussions';
        } else if (sectionType === 'recommendations') {
          existingContent =
            '• Share more technical deep-dives and project case studies\n• Engage with thought leaders in Web3 and AI space\n• Consider publishing articles on LinkedIn Pulse\n• Join and contribute to relevant industry groups';
        }
      }

      setInlineEditData({
        sectionType,
        content: existingContent,
      });
    } else {
      // Edit username
      setInlineEditData({
        username: currentData.username,
        analysis: currentData.analysis?.content || '',
      });
    }
    setInlineEditing(platform);
  };

  const handleInlineSave = async (platform: Platform) => {
    try {
      // Update the platform data
      const updatedData = {
        ...platformData[platform],
        username: inlineEditData.username || platformData[platform].username,
        analysis: {
          ...platformData[platform].analysis,
          content: inlineEditData.analysis || inlineEditData.content,
        },
      };

      setPlatformData((prev) => ({
        ...prev,
        [platform]: updatedData,
      }));

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        `socialData_${platform}`,
        JSON.stringify(updatedData.data)
      );

      // Update user data
      const userDataRaw = await AsyncStorage.getItem('userData');
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      userData.usernames = {
        ...userData.usernames,
        [platform]: inlineEditData.username || platformData[platform].username,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Update persona data
      const personaDataRaw = await AsyncStorage.getItem('personaData');
      const personaData = personaDataRaw ? JSON.parse(personaDataRaw) : {};
      if (personaData.sections) {
        const sectionIndex = personaData.sections.findIndex((s: any) =>
          s.heading.toLowerCase().includes(platform)
        );
        if (sectionIndex !== -1) {
          personaData.sections[sectionIndex].content =
            inlineEditData.analysis || inlineEditData.content;
          await AsyncStorage.setItem(
            'personaData',
            JSON.stringify(personaData)
          );
        }
      }

      setInlineEditing(null);
      setInlineEditData(null);
      Alert.alert('Success', 'Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const handleInlineCancel = () => {
    setInlineEditing(null);
    setInlineEditData(null);
  };

  const handleSave = async (platform: Platform) => {
    try {
      // Update the platform data
      const updatedData = {
        ...platformData[platform],
        username: editData.username,
        analysis: {
          ...platformData[platform].analysis,
          content: editData.analysis,
        },
      };

      setPlatformData((prev) => ({
        ...prev,
        [platform]: updatedData,
      }));

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        `socialData_${platform}`,
        JSON.stringify(updatedData.data)
      );

      // Update user data
      const userDataRaw = await AsyncStorage.getItem('userData');
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      userData.usernames = {
        ...userData.usernames,
        [platform]: editData.username,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));

      // Update persona data
      const personaDataRaw = await AsyncStorage.getItem('personaData');
      const personaData = personaDataRaw ? JSON.parse(personaDataRaw) : {};
      if (personaData.sections) {
        const sectionIndex = personaData.sections.findIndex((s: any) =>
          s.heading.toLowerCase().includes(platform)
        );
        if (sectionIndex !== -1) {
          personaData.sections[sectionIndex].content = editData.analysis;
          await AsyncStorage.setItem(
            'personaData',
            JSON.stringify(personaData)
          );
        }
      }

      setIsEditing(null);
      setEditData(null);
      Alert.alert('Success', 'Data saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save data');
    }
  };

  const handleConnect = async (platform: Platform) => {
    // Show input dialog for username/URL
    Alert.prompt(
      `Connect ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      `Enter your ${platform} ${
        platform === 'linkedin' ? 'profile URL' : 'username'
      }:`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Connect',
          onPress: async (username) => {
            if (username && username.trim()) {
              await connectSocialMedia(platform, username.trim());
            }
          },
        },
      ],
      'plain-text'
    );
  };

  const connectSocialMedia = async (platform: Platform, username: string) => {
    try {
      console.log(`🔄 Connecting ${platform} with username:`, username);

      let body: any = {};
      if (platform === 'linkedin') {
        body.url = username;
      } else {
        body.username = username;
      }

      const SCRAPE_ENDPOINTS = {
        instagram:
          'https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/scrape/instagram',
        twitter:
          'https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/scrape/twitter',
        linkedin:
          'https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/scrape/linkedin',
      };

      console.log(
        `📡 Making request to ${SCRAPE_ENDPOINTS[platform]} with body:`,
        body
      );

      const res = await fetch(SCRAPE_ENDPOINTS[platform], {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(`📊 Response status for ${platform}:`, res.status);

      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Received data for ${platform}:`, data);

        // Save data to AsyncStorage
        console.log(`💾 Saving ${platform} data to AsyncStorage...`);
        await AsyncStorage.setItem(
          `socialData_${platform}`,
          JSON.stringify(data)
        );

        // Save username
        const userDataRaw = await AsyncStorage.getItem('userData');
        const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
        userData.usernames = {
          ...userData.usernames,
          [platform]: username,
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        console.log(`✅ Saved username for ${platform}:`, username);

        // Update platform data
        setPlatformData((prev) => ({
          ...prev,
          [platform]: {
            connected: true,
            username: username,
            data: data,
            analysis: {
              heading: `${
                platform.charAt(0).toUpperCase() + platform.slice(1)
              } Analysis`,
              content: `Analysis for ${username} on ${platform}`,
            },
          },
        }));

        Alert.alert(
          'Success',
          `${
            platform.charAt(0).toUpperCase() + platform.slice(1)
          } connected successfully!`
        );
      } else {
        console.error(`❌ Error connecting ${platform}:`, res.statusText);
        Alert.alert(
          'Error',
          `Failed to connect ${platform}. Please try again.`
        );
      }
    } catch (error) {
      console.error(`❌ Error connecting ${platform}:`, error);
      Alert.alert('Error', `Failed to connect ${platform}. Please try again.`);
    }
  };

  const renderInstagramAnalysis = () => {
    const data = platformData.instagram;
    if (!data.connected) {
      return (
        <View style={styles.connectContainer}>
          <Instagram size={48} color="#E4405F" />
          <Text style={styles.connectTitle}>Connect Instagram</Text>
          <Text style={styles.connectDescription}>
            Connect your Instagram account to see detailed analysis
          </Text>
          <TouchableOpacity
            style={[styles.connectButton, { backgroundColor: '#E4405F' }]}
            onPress={() => handleConnect('instagram')}
          >
            <Text style={styles.connectButtonText}>Connect Instagram</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.analysisContainer}>
        <View style={styles.headerSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImage}>
              <User size={32} color="#FFD700" />
            </View>
            <View style={styles.profileDetails}>
              {inlineEditing === 'instagram' ? (
                <TextInput
                  style={styles.inlineInput}
                  value={inlineEditData?.username || ''}
                  onChangeText={(text) =>
                    setInlineEditData((prev: any) => ({
                      ...prev,
                      username: text,
                    }))
                  }
                  placeholder="Username"
                  placeholderTextColor="#666"
                />
              ) : (
                <Text style={styles.username}>@{data.username}</Text>
              )}
              <Text style={styles.followers}>865 followers • 5 posts</Text>
            </View>
          </View>
          {inlineEditing === 'instagram' ? (
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleInlineSave('instagram')}
              >
                <Save size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleInlineCancel}
              >
                <X size={20} color="#F44336" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEdit('instagram')}
            >
              <Edit3 size={20} color="#FFD700" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <BarChart3 size={24} color="#FFD700" />
            <Text style={styles.metricValue}>25.24%</Text>
            <Text style={styles.metricLabel}>Engagement Rate</Text>
          </View>
          <View style={styles.metricCard}>
            <TrendingUp size={24} color="#FFD700" />
            <Text style={styles.metricValue}>149-249</Text>
            <Text style={styles.metricLabel}>Avg. Likes</Text>
          </View>
          <View style={styles.metricCard}>
            <MessageCircle size={24} color="#FFD700" />
            <Text style={styles.metricValue}>3-21</Text>
            <Text style={styles.metricLabel}>Avg. Comments</Text>
          </View>
        </View>

        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Content Analysis</Text>
            <TouchableOpacity
              style={styles.sectionEditButton}
              onPress={() => handleEdit('instagram', 'content')}
            >
              <Edit3 size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
          {inlineEditing === 'instagram' &&
          inlineEditData?.sectionType === 'content' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={inlineEditData?.content || ''}
              onChangeText={(text) =>
                setInlineEditData((prev: any) => ({
                  ...prev,
                  content: text,
                }))
              }
              placeholder="Enter content analysis"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          ) : (
            <>
              <Text style={styles.analysisText}>
                • Content Types: Primarily image posts (GraphSidecar and
                GraphImage)
              </Text>
              <Text style={styles.analysisText}>
                • Engagement: High engagement on posts, with likes ranging from
                149 to 249
              </Text>
              <Text style={styles.analysisText}>
                • Captions: Casual and humorous tone, often using emojis
              </Text>
              <Text style={styles.analysisText}>
                • Hashtags: Limited use, indicating focus on personal branding
              </Text>
            </>
          )}
        </View>

        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Behavioral Insights</Text>
            <TouchableOpacity
              style={styles.sectionEditButton}
              onPress={() => handleEdit('instagram', 'behavioral')}
            >
              <Edit3 size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
          {inlineEditing === 'instagram' &&
          inlineEditData?.sectionType === 'behavioral' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={inlineEditData?.content || ''}
              onChangeText={(text) =>
                setInlineEditData((prev: any) => ({
                  ...prev,
                  content: text,
                }))
              }
              placeholder="Enter behavioral insights"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          ) : (
            <>
              <Text style={styles.analysisText}>
                • Posting Frequency: Infrequent posting with 5 total posts
              </Text>
              <Text style={styles.analysisText}>
                • Engagement Style: Actively engages with followers through
                comments
              </Text>
              <Text style={styles.analysisText}>
                • Content Themes: Lifestyle and personal moments, Web3 trader
                identity
              </Text>
            </>
          )}
        </View>

        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <TouchableOpacity
              style={styles.sectionEditButton}
              onPress={() => handleEdit('instagram', 'recommendations')}
            >
              <Edit3 size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
          {inlineEditing === 'instagram' &&
          inlineEditData?.sectionType === 'recommendations' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={inlineEditData?.content || ''}
              onChangeText={(text) =>
                setInlineEditData((prev: any) => ({
                  ...prev,
                  content: text,
                }))
              }
              placeholder="Enter recommendations"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          ) : (
            <>
              <Text style={styles.analysisText}>
                • Increase posting frequency to maintain engagement
              </Text>
              <Text style={styles.analysisText}>
                • Share more Web3 and NFT insights to attract niche audience
              </Text>
              <Text style={styles.analysisText}>
                • Utilize stories and polls for interactive engagement
              </Text>
              <Text style={styles.analysisText}>
                • Explore partnerships with tech and lifestyle brands
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderTwitterAnalysis = () => {
    const data = platformData.twitter;
    if (!data.connected) {
      return (
        <View style={styles.connectContainer}>
          <Twitter size={48} color="#1DA1F2" />
          <Text style={styles.connectTitle}>Connect Twitter</Text>
          <Text style={styles.connectDescription}>
            Connect your Twitter account to see detailed analysis
          </Text>
          <TouchableOpacity
            style={[styles.connectButton, { backgroundColor: '#1DA1F2' }]}
            onPress={() => handleConnect('twitter')}
          >
            <Text style={styles.connectButtonText}>Connect Twitter</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.analysisContainer}>
        <View style={styles.headerSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImage}>
              <User size={32} color="#FFD700" />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.username}>@{data.username}</Text>
              <Text style={styles.followers}>1.2K followers • 342 tweets</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit('twitter')}
          >
            <Edit3 size={20} color="#FFD700" />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <BarChart3 size={24} color="#FFD700" />
            <Text style={styles.metricValue}>18.5%</Text>
            <Text style={styles.metricLabel}>Engagement Rate</Text>
          </View>
          <View style={styles.metricCard}>
            <TrendingUp size={24} color="#FFD700" />
            <Text style={styles.metricValue}>45-89</Text>
            <Text style={styles.metricLabel}>Avg. Retweets</Text>
          </View>
          <View style={styles.metricCard}>
            <MessageCircle size={24} color="#FFD700" />
            <Text style={styles.metricValue}>12-34</Text>
            <Text style={styles.metricLabel}>Avg. Replies</Text>
          </View>
        </View>

        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Content Analysis</Text>
            <TouchableOpacity
              style={styles.sectionEditButton}
              onPress={() => handleEdit('twitter', 'content')}
            >
              <Edit3 size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
          {inlineEditing === 'twitter' &&
          inlineEditData?.sectionType === 'content' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={inlineEditData?.content || ''}
              onChangeText={(text) =>
                setInlineEditData((prev: any) => ({
                  ...prev,
                  content: text,
                }))
              }
              placeholder="Enter content analysis"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          ) : (
            <>
              <Text style={styles.analysisText}>
                • Content Types: Mix of text tweets, quote tweets, and media
                posts
              </Text>
              <Text style={styles.analysisText}>
                • Engagement: Strong engagement on tech and Web3 related content
              </Text>
              <Text style={styles.analysisText}>
                • Tone: Professional yet approachable, often sharing insights
              </Text>
              <Text style={styles.analysisText}>
                • Hashtags: Strategic use of #Web3, #NFT, #Tech hashtags
              </Text>
            </>
          )}
        </View>

        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Behavioral Insights</Text>
            <TouchableOpacity
              style={styles.sectionEditButton}
              onPress={() => handleEdit('twitter', 'behavioral')}
            >
              <Edit3 size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
          {inlineEditing === 'twitter' &&
          inlineEditData?.sectionType === 'behavioral' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={inlineEditData?.content || ''}
              onChangeText={(text) =>
                setInlineEditData((prev: any) => ({
                  ...prev,
                  content: text,
                }))
              }
              placeholder="Enter behavioral insights"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          ) : (
            <>
              <Text style={styles.analysisText}>
                • Posting Frequency: Active daily engagement with 342 total
                tweets
              </Text>
              <Text style={styles.analysisText}>
                • Engagement Style: Responds to mentions and participates in
                discussions
              </Text>
              <Text style={styles.analysisText}>
                • Content Themes: Tech insights, Web3 updates, personal thoughts
              </Text>
            </>
          )}
        </View>

        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <TouchableOpacity
              style={styles.sectionEditButton}
              onPress={() => handleEdit('twitter', 'recommendations')}
            >
              <Edit3 size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
          {inlineEditing === 'twitter' &&
          inlineEditData?.sectionType === 'recommendations' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={inlineEditData?.content || ''}
              onChangeText={(text) =>
                setInlineEditData((prev: any) => ({
                  ...prev,
                  content: text,
                }))
              }
              placeholder="Enter recommendations"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          ) : (
            <>
              <Text style={styles.analysisText}>
                • Continue sharing valuable tech insights to maintain authority
              </Text>
              <Text style={styles.analysisText}>
                • Engage more with Web3 community discussions
              </Text>
              <Text style={styles.analysisText}>
                • Consider creating Twitter threads for complex topics
              </Text>
              <Text style={styles.analysisText}>
                • Leverage Twitter Spaces for community building
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderLinkedInAnalysis = () => {
    const data = platformData.linkedin;
    if (!data.connected) {
      return (
        <View style={styles.connectContainer}>
          <Linkedin size={48} color="#0077B5" />
          <Text style={styles.connectTitle}>Connect LinkedIn</Text>
          <Text style={styles.connectDescription}>
            Connect your LinkedIn account to see detailed analysis
          </Text>
          <TouchableOpacity
            style={[styles.connectButton, { backgroundColor: '#0077B5' }]}
            onPress={() => handleConnect('linkedin')}
          >
            <Text style={styles.connectButtonText}>Connect LinkedIn</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.analysisContainer}>
        <View style={styles.headerSection}>
          <View style={styles.profileInfo}>
            <View style={styles.profileImage}>
              <User size={32} color="#FFD700" />
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.username}>{data.username}</Text>
              <Text style={styles.followers}>
                2.1K connections • Tech Professional
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit('linkedin')}
          >
            <Edit3 size={20} color="#FFD700" />
          </TouchableOpacity>
        </View>

        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <BarChart3 size={24} color="#FFD700" />
            <Text style={styles.metricValue}>12.8%</Text>
            <Text style={styles.metricLabel}>Profile Views</Text>
          </View>
          <View style={styles.metricCard}>
            <TrendingUp size={24} color="#FFD700" />
            <Text style={styles.metricValue}>156</Text>
            <Text style={styles.metricLabel}>Post Views</Text>
          </View>
          <View style={styles.metricCard}>
            <MessageCircle size={24} color="#FFD700" />
            <Text style={styles.metricValue}>23</Text>
            <Text style={styles.metricLabel}>Engagements</Text>
          </View>
        </View>

        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professional Profile</Text>
            <TouchableOpacity
              style={styles.sectionEditButton}
              onPress={() => handleEdit('linkedin', 'profile')}
            >
              <Edit3 size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
          {inlineEditing === 'linkedin' &&
          inlineEditData?.sectionType === 'profile' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={inlineEditData?.content || ''}
              onChangeText={(text) =>
                setInlineEditData((prev: any) => ({
                  ...prev,
                  content: text,
                }))
              }
              placeholder="Enter professional profile"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          ) : (
            <>
              <Text style={styles.analysisText}>
                • Industry: Technology and Web3 Development
              </Text>
              <Text style={styles.analysisText}>
                • Experience: 5+ years in software development and blockchain
              </Text>
              <Text style={styles.analysisText}>
                • Skills: React Native, Blockchain, AI/ML, Full-Stack
                Development
              </Text>
              <Text style={styles.analysisText}>
                • Education: Computer Science background with ongoing learning
              </Text>
            </>
          )}
        </View>

        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Content Strategy</Text>
            <TouchableOpacity
              style={styles.sectionEditButton}
              onPress={() => handleEdit('linkedin', 'strategy')}
            >
              <Edit3 size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
          {inlineEditing === 'linkedin' &&
          inlineEditData?.sectionType === 'strategy' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={inlineEditData?.content || ''}
              onChangeText={(text) =>
                setInlineEditData((prev: any) => ({
                  ...prev,
                  content: text,
                }))
              }
              placeholder="Enter content strategy"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          ) : (
            <>
              <Text style={styles.analysisText}>
                • Posts: Shares technical insights and industry updates
              </Text>
              <Text style={styles.analysisText}>
                • Engagement: Actively comments on industry posts and articles
              </Text>
              <Text style={styles.analysisText}>
                • Networking: Participates in tech groups and discussions
              </Text>
            </>
          )}
        </View>

        <View style={styles.analysisSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <TouchableOpacity
              style={styles.sectionEditButton}
              onPress={() => handleEdit('linkedin', 'recommendations')}
            >
              <Edit3 size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
          {inlineEditing === 'linkedin' &&
          inlineEditData?.sectionType === 'recommendations' ? (
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={inlineEditData?.content || ''}
              onChangeText={(text) =>
                setInlineEditData((prev: any) => ({
                  ...prev,
                  content: text,
                }))
              }
              placeholder="Enter recommendations"
              placeholderTextColor="#666"
              multiline
              numberOfLines={6}
            />
          ) : (
            <>
              <Text style={styles.analysisText}>
                • Share more technical deep-dives and project case studies
              </Text>
              <Text style={styles.analysisText}>
                • Engage with thought leaders in Web3 and AI space
              </Text>
              <Text style={styles.analysisText}>
                • Consider publishing articles on LinkedIn Pulse
              </Text>
              <Text style={styles.analysisText}>
                • Join and contribute to relevant industry groups
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderStoryboard = () => {
    if (!storyboardData) {
      return (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No persona data available</Text>
        </View>
      );
    }

    // Check if we have the full API response structure
    if (storyboardData.storyboard_slides) {
      return (
        <ScrollView style={styles.storyboardContainer}>
          {/* Persona Summary */}
          {storyboardData.persona_summary && (
            <View style={styles.summarySection}>
              <BlurView intensity={15} style={styles.summaryBlur}>
                <Text style={styles.summaryTitle}>Your Persona Summary</Text>
                <View style={styles.summaryGrid}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Followers</Text>
                    <Text style={styles.summaryValue}>
                      {storyboardData.persona_summary.followers}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Posts</Text>
                    <Text style={styles.summaryValue}>
                      {storyboardData.persona_summary.posts_count}
                    </Text>
                  </View>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Engagement</Text>
                    <Text style={styles.summaryValue}>
                      {(
                        storyboardData.persona_summary.average_engagement * 100
                      ).toFixed(1)}
                      %
                    </Text>
                  </View>
                </View>
                <Text style={styles.summaryText}>
                  {storyboardData.persona_summary.demographics}
                </Text>
                <Text style={styles.summaryText}>
                  {storyboardData.persona_summary.personality}
                </Text>
                <Text style={styles.summaryText}>
                  {storyboardData.persona_summary.interests}
                </Text>
              </BlurView>
            </View>
          )}

          {/* Analytics */}
          {storyboardData.analytics && (
            <View style={styles.analyticsSection}>
              <BlurView intensity={15} style={styles.analyticsBlur}>
                <Text style={styles.analyticsTitle}>Analytics Overview</Text>

                {/* Interests */}
                {storyboardData.analytics.interests && (
                  <View style={styles.analyticsSubsection}>
                    <Text style={styles.analyticsSubtitle}>Top Interests</Text>
                    <View style={styles.interestsGrid}>
                      {Object.entries(storyboardData.analytics.interests)
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .slice(0, 6)
                        .map(([interest, score], index) => (
                          <View
                            key={`interest-${interest}-${index}`}
                            style={styles.interestItem}
                          >
                            <Text style={styles.interestName}>{interest}</Text>
                            <View style={styles.interestBar}>
                              <View
                                style={[
                                  styles.interestFill,
                                  { width: `${score as number}%` },
                                ]}
                              />
                            </View>
                            <Text style={styles.interestScore}>
                              {score as number}%
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                )}

                {/* Personality Traits */}
                {storyboardData.analytics.personality_traits && (
                  <View style={styles.analyticsSubsection}>
                    <Text style={styles.analyticsSubtitle}>
                      Personality Traits
                    </Text>
                    <View style={styles.traitsGrid}>
                      {Object.entries(
                        storyboardData.analytics.personality_traits
                      )
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .slice(0, 4)
                        .map(([trait, score], index) => (
                          <View
                            key={`trait-${trait}-${index}`}
                            style={styles.traitItem}
                          >
                            <Text style={styles.traitName}>{trait}</Text>
                            <Text style={styles.traitScore}>
                              {score as number}%
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                )}
              </BlurView>
            </View>
          )}

          {/* Storyboard Slides */}
          {storyboardData.storyboard_slides && (
            <View style={styles.slidesSection}>
              {Object.entries(storyboardData.storyboard_slides).map(
                ([slideKey, slideData]: [string, any], slideIndex: number) => (
                  <View
                    key={`slide-${slideKey}-${slideIndex}`}
                    style={styles.slideContainer}
                  >
                    <BlurView intensity={15} style={styles.slideBlur}>
                      <Text style={styles.slideTitle}>{slideData.title}</Text>
                      <Text style={styles.slideSubtitle}>
                        {slideData.subtitle}
                      </Text>

                      {slideData.content &&
                        Array.isArray(slideData.content) && (
                          <View style={styles.slideContent}>
                            {slideData.content.map(
                              (point: string, index: number) => (
                                <View
                                  key={`content-${slideKey}-${index}`}
                                  style={styles.contentPoint}
                                >
                                  <Text style={styles.bulletPoint}>•</Text>
                                  <Text style={styles.contentText}>
                                    {point}
                                  </Text>
                                </View>
                              )
                            )}
                          </View>
                        )}

                      {slideData.points && Array.isArray(slideData.points) && (
                        <View style={styles.slideContent}>
                          {slideData.points.map(
                            (point: string, index: number) => (
                              <View
                                key={`point-${slideKey}-${index}`}
                                style={styles.contentPoint}
                              >
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.contentText}>{point}</Text>
                              </View>
                            )
                          )}
                        </View>
                      )}
                    </BlurView>
                  </View>
                )
              )}
            </View>
          )}
        </ScrollView>
      );
    }

    // Fallback to basic persona data
    return (
      <ScrollView style={styles.storyboardContainer}>
        <View style={styles.basicSection}>
          <BlurView intensity={15} style={styles.basicBlur}>
            <Text style={styles.basicTitle}>Your Digital Identity</Text>
            <Text style={styles.basicText}>
              Based on your social media presence, we've analyzed your digital
              footprint and preferences.
            </Text>
            {storyboardData.sections &&
              storyboardData.sections.map((section: any, index: number) => (
                <View key={index} style={styles.sectionItem}>
                  <Text style={styles.sectionTitleBasic}>
                    {section.heading}
                  </Text>
                  <Text style={styles.sectionContent}>{section.content}</Text>
                </View>
              ))}
          </BlurView>
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'instagram':
        return renderInstagramAnalysis();
      case 'twitter':
        return renderTwitterAnalysis();
      case 'linkedin':
        return renderLinkedInAnalysis();
      default:
        return null;
    }
  };

  const debugDataStorage = async () => {
    try {
      console.log('🔍 Debugging data storage...');

      const userDataRaw = await AsyncStorage.getItem('userData');
      const userData = userDataRaw ? JSON.parse(userDataRaw) : {};
      console.log('📱 User data:', userData);

      for (const platform of [
        'instagram',
        'twitter',
        'linkedin',
      ] as Platform[]) {
        const socialDataRaw = await AsyncStorage.getItem(
          `socialData_${platform}`
        );
        const socialData = socialDataRaw ? JSON.parse(socialDataRaw) : null;
        console.log(`📊 ${platform} data:`, socialData ? 'Found' : 'Not found');
        if (socialData) {
          console.log(`📊 ${platform} data keys:`, Object.keys(socialData));
        }
      }

      const personaDataRaw = await AsyncStorage.getItem('personaData');
      const personaData = personaDataRaw ? JSON.parse(personaDataRaw) : null;
      console.log('🎭 Persona data:', personaData ? 'Found' : 'Not found');

      Alert.alert('Debug Info', 'Check console for data storage debug info');
    } catch (error) {
      console.error('❌ Debug error:', error);
      Alert.alert('Debug Error', 'Failed to debug data storage');
    }
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A']}
          style={styles.background}
        />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.editHeader}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsEditing(null);
                setEditData(null);
              }}
            >
              <X size={24} color="#FFD700" />
            </TouchableOpacity>
            <Text style={styles.editTitle}>Edit {activeTab} Data</Text>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => handleSave(isEditing)}
            >
              <Save size={24} color="#FFD700" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.editContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username</Text>
              <TextInput
                style={styles.textInput}
                value={editData?.username || ''}
                onChangeText={(text) =>
                  setEditData((prev: any) => ({ ...prev, username: text }))
                }
                placeholder="Enter username"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Analysis</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={editData?.analysis || ''}
                onChangeText={(text) =>
                  setEditData((prev: any) => ({ ...prev, analysis: text }))
                }
                placeholder="Enter analysis content"
                placeholderTextColor="#666"
                multiline
                numberOfLines={10}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A']}
        style={styles.background}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Persona Analysis</Text>
          <Text style={styles.subtitle}>
            Comprehensive social media insights
          </Text>
          <TouchableOpacity
            style={styles.debugButton}
            onPress={debugDataStorage}
          >
            <Text style={styles.debugButtonText}>Debug Data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'instagram' && styles.activeTab]}
            onPress={() => setActiveTab('instagram')}
          >
            <Instagram
              size={20}
              color={activeTab === 'instagram' ? '#FFD700' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'instagram' && styles.activeTabText,
              ]}
            >
              Instagram
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'twitter' && styles.activeTab]}
            onPress={() => setActiveTab('twitter')}
          >
            <Twitter
              size={20}
              color={activeTab === 'twitter' ? '#FFD700' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'twitter' && styles.activeTabText,
              ]}
            >
              Twitter
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'linkedin' && styles.activeTab]}
            onPress={() => setActiveTab('linkedin')}
          >
            <Linkedin
              size={20}
              color={activeTab === 'linkedin' ? '#FFD700' : '#666'}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === 'linkedin' && styles.activeTabText,
              ]}
            >
              LinkedIn
            </Text>
          </TouchableOpacity>
        </View>

        {renderContent()}

        {renderStoryboard()}
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
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  activeTab: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FFD700',
  },
  analysisContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  connectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  connectTitle: {
    fontSize: 24,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  connectDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 32,
  },
  connectButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  connectButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,215,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileDetails: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  followers: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  editButton: {
    padding: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  metricValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  analysisSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
  },
  sectionEditButton: {
    padding: 8,
  },
  analysisText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 8,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 16,
  },
  editTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cancelButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
    marginRight: 8,
  },
  editContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  storyboardContainer: {
    flex: 1,
    padding: 24,
  },
  summarySection: {
    marginBottom: 24,
  },
  summaryBlur: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  summaryValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFD700',
  },
  summaryText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  analyticsSection: {
    marginBottom: 24,
  },
  analyticsBlur: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  analyticsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 12,
  },
  analyticsSubsection: {
    marginBottom: 16,
  },
  analyticsSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 8,
  },
  interestsGrid: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  interestItem: {
    flex: 1,
    alignItems: 'center',
  },
  interestName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  interestBar: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    marginHorizontal: 8,
  },
  interestFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 6,
  },
  interestScore: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  traitsGrid: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  traitItem: {
    flex: 1,
    alignItems: 'center',
  },
  traitName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  traitScore: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  slidesSection: {
    marginBottom: 24,
  },
  slideContainer: {
    marginBottom: 16,
  },
  slideBlur: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  slideTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  slideContent: {
    marginBottom: 8,
  },
  contentPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bulletPoint: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginRight: 8,
  },
  contentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  basicSection: {
    marginBottom: 24,
  },
  basicBlur: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  basicTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 12,
  },
  basicText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  sectionItem: {
    marginBottom: 16,
  },
  sectionTitleBasic: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFD700',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  inlineInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  debugButton: {
    backgroundColor: 'rgba(255,215,0,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    marginTop: 8,
  },
  debugButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
  },
});
