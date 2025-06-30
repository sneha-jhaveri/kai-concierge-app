import React, { useState, useEffect } from 'react';
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
import { MapPin, ShoppingBag, Briefcase, Heart, Car, Chrome as Home, Utensils, Sparkles, ChevronRight, Crown, Star, Calendar } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Service {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  gradient: string[];
  image: string;
  premium: boolean;
  category: string;
}

const luxuryServices: Service[] = [
  {
    id: '1',
    title: 'Luxury Travel Planning',
    subtitle: 'Bespoke experiences worldwide',
    icon: MapPin,
    color: '#FF6B6B',
    gradient: ['#FF6B6B', '#FF8E8E'],
    image: 'https://images.pexels.com/photos/2373201/pexels-photo-2373201.jpeg?auto=compress&cs=tinysrgb&w=800',
    premium: true,
    category: 'Travel',
  },
  {
    id: '2',
    title: 'Personal Shopping',
    subtitle: 'Curated luxury fashion & lifestyle',
    icon: ShoppingBag,
    color: '#4ECDC4',
    gradient: ['#4ECDC4', '#44A08D'],
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800',
    premium: true,
    category: 'Lifestyle',
  },
  {
    id: '3',
    title: 'Executive Assistance',
    subtitle: 'Professional life management',
    icon: Briefcase,
    color: '#45B7D1',
    gradient: ['#45B7D1', '#96C93D'],
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
    premium: false,
    category: 'Business',
  },
  {
    id: '4',
    title: 'Wellness & Fitness',
    subtitle: 'Holistic health optimization',
    icon: Heart,
    color: '#96CEB4',
    gradient: ['#96CEB4', '#FFECD2'],
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=800',
    premium: true,
    category: 'Health',
  },
  {
    id: '5',
    title: 'Luxury Transportation',
    subtitle: 'Premium mobility solutions',
    icon: Car,
    color: '#A8E6CF',
    gradient: ['#A8E6CF', '#DCEDC8'],
    image: 'https://images.pexels.com/photos/100656/pexels-photo-100656.jpeg?auto=compress&cs=tinysrgb&w=800',
    premium: true,
    category: 'Transport',
  },
  {
    id: '6',
    title: 'Home Management',
    subtitle: 'Residence optimization & care',
    icon: Home,
    color: '#FFD93D',
    gradient: ['#FFD93D', '#FF6B6B'],
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
    premium: false,
    category: 'Home',
  },
  {
    id: '7',
    title: 'Fine Dining & Events',
    subtitle: 'Exclusive culinary experiences',
    icon: Utensils,
    color: '#FF8A80',
    gradient: ['#FF8A80', '#FFAB91'],
    image: 'https://images.pexels.com/photos/696218/pexels-photo-696218.jpeg?auto=compress&cs=tinysrgb&w=800',
    premium: true,
    category: 'Dining',
  },
  {
    id: '8',
    title: 'Digital Life Optimization',
    subtitle: 'Tech & data organization',
    icon: Sparkles,
    color: '#81C784',
    gradient: ['#81C784', '#AED581'],
    image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800',
    premium: false,
    category: 'Technology',
  },
];

const categories = ['All', 'Travel', 'Lifestyle', 'Business', 'Health'];

export default function ServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredServices, setFilteredServices] = useState(luxuryServices);

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

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredServices(luxuryServices);
    } else {
      setFilteredServices(luxuryServices.filter(service => service.category === selectedCategory));
    }
  }, [selectedCategory]);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
  }));

  const cardsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardsOpacity.value,
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const handleServiceSelect = (service: Service) => {
    // Navigate to chat with service context
    console.log('Selected service:', service.title);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <Animated.View style={[styles.header, headerAnimatedStyle]}>
          <View style={styles.headerContent}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Luxury Services</Text>
              <Animated.View style={sparkleAnimatedStyle}>
                <Sparkles size={24} color="#FFD700" />
              </Animated.View>
            </View>
            <Text style={styles.subtitle}>Curated experiences tailored for you</Text>
          </View>
        </Animated.View>

        {/* Category Filter */}
        <Animated.View style={[styles.categoriesContainer, cardsAnimatedStyle]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.selectedCategoryButton,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <BlurView
                  intensity={selectedCategory === category ? 25 : 15}
                  style={[
                    styles.categoryBlur,
                    selectedCategory === category && styles.selectedCategoryBlur,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category && styles.selectedCategoryText,
                    ]}
                  >
                    {category}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Services Grid */}
        <ScrollView
          style={styles.servicesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.servicesContent}
        >
          <Animated.View style={cardsAnimatedStyle}>
            {filteredServices.map((service, index) => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => handleServiceSelect(service)}
              >
                <View style={styles.serviceImageContainer}>
                  <Image source={{ uri: service.image }} style={styles.serviceImage} />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.serviceImageOverlay}
                  />
                  {service.premium && (
                    <View style={styles.premiumBadge}>
                      <Crown size={12} color="#0A0A0A" />
                    </View>
                  )}
                </View>

                <BlurView intensity={20} style={styles.serviceContent}>
                  <View style={styles.serviceInfo}>
                    <View style={styles.serviceHeader}>
                      <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                        <service.icon size={20} color="#FFFFFF" />
                      </View>
                      <View style={styles.serviceRating}>
                        <Star size={12} color="#FFD700" fill="#FFD700" />
                        <Text style={styles.ratingText}>4.9</Text>
                      </View>
                    </View>
                    
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                    
                    <View style={styles.serviceFooter}>
                      <Text style={styles.categoryTag}>{service.category}</Text>
                      <ChevronRight size={16} color="#FFD700" />
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerContent: {
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  categoriesContainer: {
    paddingBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 24,
  },
  categoryButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedCategoryButton: {
    transform: [{ scale: 1.05 }],
  },
  categoryBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedCategoryBlur: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#CCCCCC',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  servicesContainer: {
    flex: 1,
  },
  servicesContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  serviceCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  serviceImageContainer: {
    position: 'relative',
    height: 160,
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  serviceImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  serviceInfo: {
    padding: 20,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
    marginLeft: 4,
  },
  serviceTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginBottom: 16,
    lineHeight: 20,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTag: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
});