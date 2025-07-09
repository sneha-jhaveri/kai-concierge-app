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
import {
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  RefreshCw,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface Service {
  name: string;
  description: string;
}

interface PersonaData {
  title?: string;
  sections?: Array<{
    heading: string;
    content: string;
  }>;
}

export default function ServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);

  useEffect(() => {
    loadPersonaData();
    fetchServices();
  }, []);

  const loadPersonaData = async () => {
    try {
      const personaDataRaw = await AsyncStorage.getItem('personaData');
      if (personaDataRaw) {
        const data = JSON.parse(personaDataRaw);
        setPersonaData(data);
        console.log('✅ Loaded persona data for services:', data);
      }
    } catch (error) {
      console.error('❌ Error loading persona data:', error);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);

      // Get persona data
      const personaDataRaw = await AsyncStorage.getItem('personaData');
      if (!personaDataRaw) {
        console.log('⚠️ No persona data available, showing default services');
        setServices(getDefaultServices());
        setLoading(false);
        return;
      }

      const personaData = JSON.parse(personaDataRaw);

      // Create full analysis string for API
      let fullAnalysis = '';
      if (personaData.full_analysis) {
        fullAnalysis = personaData.full_analysis;
      } else if (personaData.title) {
        fullAnalysis += `# ${personaData.title}\n\n`;
      }
      if (personaData.sections) {
        personaData.sections.forEach((section: any) => {
          fullAnalysis += `## ${section.heading}\n${section.content}\n\n`;
        });
      }

      console.log(
        '📤 Sending persona analysis to services API:',
        fullAnalysis.substring(0, 200) + '...'
      );

      // Use the correct API endpoint
      try {
        const response = await fetch(
          'https://your-api-endpoint.com/api/suggest-services',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personaAnalysis: fullAnalysis,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Received services from API:', data);
          setServices(data);
        } else {
          console.log('⚠️ API not available, using personalized services');
          const personalizedServices = getPersonalizedServices(personaData);
          setServices(personalizedServices);
        }
      } catch (apiError) {
        console.log('⚠️ API error, using personalized services:', apiError);
        const personalizedServices = getPersonalizedServices(personaData);
        setServices(personalizedServices);
      }
    } catch (error) {
      console.error('❌ Error fetching services:', error);
      setServices(getDefaultServices());
    } finally {
      setLoading(false);
    }
  };

  const getPersonalizedServices = (personaData: any): Service[] => {
    // Generate personalized services based on persona data
    const baseServices = getDefaultServices();

    // Add personalized services based on persona analysis
    if (personaData.full_analysis) {
      const analysis = personaData.full_analysis.toLowerCase();

      if (analysis.includes('tech') || analysis.includes('web3')) {
        baseServices.push({
          name: 'Tech Innovation Consulting',
          description:
            'Expert guidance on emerging technologies and digital transformation strategies.',
        });
      }

      if (analysis.includes('lifestyle') || analysis.includes('fashion')) {
        baseServices.push({
          name: 'Luxury Lifestyle Management',
          description:
            'Comprehensive lifestyle services including personal styling and luxury experiences.',
        });
      }

      if (analysis.includes('business') || analysis.includes('entrepreneur')) {
        baseServices.push({
          name: 'Business Strategy & Growth',
          description:
            'Strategic business consulting and growth acceleration services.',
        });
      }
    }

    return baseServices;
  };

  const getDefaultServices = (): Service[] => {
    return [
      {
        name: 'Personal Styling Consultation',
        description:
          'Get personalized fashion advice and styling recommendations tailored to your lifestyle and preferences.',
      },
      {
        name: 'Luxury Travel Planning',
        description:
          'Expert travel planning for premium experiences, including exclusive accommodations and unique experiences.',
      },
      {
        name: 'Fine Dining Recommendations',
        description:
          'Curated restaurant suggestions and reservation services for the best dining experiences.',
      },
      {
        name: 'Event Planning & Coordination',
        description:
          'Professional event planning services for special occasions, corporate events, and celebrations.',
      },
      {
        name: 'Personal Shopping Service',
        description:
          'Handpicked shopping experiences with personal shoppers for clothing, accessories, and lifestyle items.',
      },
      {
        name: 'Wellness & Spa Services',
        description:
          'Premium wellness experiences including spa treatments, fitness coaching, and relaxation services.',
      },
    ];
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };

  const handleServicePress = (service: Service) => {
    Alert.alert(service.name, service.description, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Book Now',
        onPress: () => console.log('Booking service:', service.name),
      },
    ]);
  };

  const renderServiceCard = (service: Service, index: number) => (
    <TouchableOpacity
      key={`service-${index}`}
      style={styles.serviceCard}
      onPress={() => handleServicePress(service)}
    >
      <LinearGradient
        colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 165, 0, 0.05)']}
        style={styles.serviceGradient}
      >
        <View style={styles.serviceHeader}>
          <View style={styles.serviceIcon}>
            <Sparkles size={24} color="#FFD700" />
          </View>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </View>
          <ArrowRight size={20} color="#FFD700" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerIcon}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.iconGradient}
              >
                <Sparkles size={24} color="#0A0A0A" />
              </LinearGradient>
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Personalized Services</Text>
              <Text style={styles.headerSubtitle}>Curated just for you</Text>
            </View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                size={20}
                color="#FFD700"
                style={refreshing ? styles.rotating : undefined}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFD700" />
              <Text style={styles.loadingText}>
                Loading personalized services...
              </Text>
            </View>
          ) : (
            <>
              {/* Persona Summary */}
              {personaData && (
                <View style={styles.personaSection}>
                  <BlurView intensity={15} style={styles.personaBlur}>
                    <Text style={styles.personaTitle}>
                      Based on Your Profile
                    </Text>
                    <Text style={styles.personaDescription}>
                      These services are tailored to your preferences and
                      lifestyle
                    </Text>
                  </BlurView>
                </View>
              )}

              {/* Services Grid */}
              <View style={styles.servicesGrid}>
                {services.map((service, index) =>
                  renderServiceCard(service, index)
                )}
              </View>

              {/* Contact Section */}
              <View style={styles.contactSection}>
                <BlurView intensity={15} style={styles.contactBlur}>
                  <Text style={styles.contactTitle}>
                    Need Something Special?
                  </Text>
                  <Text style={styles.contactDescription}>
                    Contact us for custom services and exclusive experiences
                  </Text>
                  <View style={styles.contactButtons}>
                    <TouchableOpacity style={styles.contactButton}>
                      <Phone size={16} color="#FFD700" />
                      <Text style={styles.contactButtonText}>Call Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactButton}>
                      <Mail size={16} color="#FFD700" />
                      <Text style={styles.contactButtonText}>Email</Text>
                    </TouchableOpacity>
                  </View>
                </BlurView>
              </View>
            </>
          )}
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 12,
  },
  iconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  refreshButton: {
    padding: 8,
  },
  rotating: {
    transform: [{ rotate: '360deg' }],
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  personaSection: {
    marginBottom: 24,
  },
  personaBlur: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  personaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 4,
  },
  personaDescription: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  serviceGradient: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
  },
  contactSection: {
    marginTop: 24,
  },
  contactBlur: {
    borderRadius: 16,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 16,
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    gap: 8,
  },
  contactButtonText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
});
