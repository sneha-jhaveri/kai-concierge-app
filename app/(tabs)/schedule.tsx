import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
import { Calendar, Clock, MapPin, User, CircleCheck as CheckCircle, CircleAlert as AlertCircle, Sparkles, Plus, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  date: string;
  location: string;
  type: 'meeting' | 'service' | 'personal' | 'travel';
  status: 'confirmed' | 'pending' | 'cancelled';
  attendees?: number;
  color: string;
}

const upcomingSchedule: ScheduleItem[] = [
  {
    id: '1',
    title: 'Spa Weekend Getaway',
    time: '10:00 AM',
    date: 'Today',
    location: 'Four Seasons Resort',
    type: 'service',
    status: 'confirmed',
    color: '#4ECDC4',
  },
  {
    id: '2',
    title: 'Personal Stylist Consultation',
    time: '2:30 PM',
    date: 'Today',
    location: 'Madison Avenue Boutique',
    type: 'service',
    status: 'confirmed',
    attendees: 2,
    color: '#FF6B6B',
  },
  {
    id: '3',
    title: 'Executive Board Meeting',
    time: '9:00 AM',
    date: 'Tomorrow',
    location: 'Corporate Office',
    type: 'meeting',
    status: 'confirmed',
    attendees: 8,
    color: '#45B7D1',
  },
  {
    id: '4',
    title: 'Fine Dining Reservation',
    time: '7:00 PM',
    date: 'Tomorrow',
    location: 'Le Bernardin',
    type: 'personal',
    status: 'pending',
    attendees: 2,
    color: '#96CEB4',
  },
  {
    id: '5',
    title: 'Business Trip to Tokyo',
    time: '6:00 AM',
    date: 'Friday',
    location: 'JFK Airport',
    type: 'travel',
    status: 'confirmed',
    color: '#FFD93D',
  },
  {
    id: '6',
    title: 'Wellness Assessment',
    time: '11:00 AM',
    date: 'Saturday',
    location: 'Premium Health Center',
    type: 'service',
    status: 'pending',
    color: '#A8E6CF',
  },
];

const timeSlots = ['Morning', 'Afternoon', 'Evening'];

export default function ScheduleScreen() {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('Morning');
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
    }, 60000);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} color="#4CAF50" />;
      case 'pending':
        return <AlertCircle size={16} color="#FFC107" />;
      case 'cancelled':
        return <AlertCircle size={16} color="#F44336" />;
      default:
        return <Clock size={16} color="#666666" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <User size={20} color="#FFFFFF" />;
      case 'service':
        return <Sparkles size={20} color="#FFFFFF" />;
      case 'travel':
        return <MapPin size={20} color="#FFFFFF" />;
      default:
        return <Calendar size={20} color="#FFFFFF" />;
    }
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
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>My Schedule</Text>
              <Animated.View style={sparkleAnimatedStyle}>
                <Calendar size={24} color="#FFD700" />
              </Animated.View>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color="#0A0A0A" />
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeContainer}>
            <Text style={styles.currentDate}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
            <Text style={styles.currentTime}>
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
        </Animated.View>

        {/* Time Slot Filter */}
        <Animated.View style={[styles.timeSlotsContainer, cardsAnimatedStyle]}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeSlotsContent}
          >
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot}
                style={[
                  styles.timeSlotButton,
                  selectedTimeSlot === slot && styles.selectedTimeSlotButton,
                ]}
                onPress={() => setSelectedTimeSlot(slot)}
              >
                <BlurView
                  intensity={selectedTimeSlot === slot ? 25 : 15}
                  style={[
                    styles.timeSlotBlur,
                    selectedTimeSlot === slot && styles.selectedTimeSlotBlur,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeSlotText,
                      selectedTimeSlot === slot && styles.selectedTimeSlotText,
                    ]}
                  >
                    {slot}
                  </Text>
                </BlurView>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Schedule Items */}
        <ScrollView
          style={styles.scheduleContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scheduleContent}
        >
          <Animated.View style={cardsAnimatedStyle}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            
            {upcomingSchedule.map((item, index) => (
              <TouchableOpacity key={item.id} style={styles.scheduleCard}>
                <BlurView intensity={15} style={styles.scheduleBlur}>
                  <View style={styles.scheduleTimeline}>
                    <View style={[styles.timelineIcon, { backgroundColor: item.color }]}>
                      {getTypeIcon(item.type)}
                    </View>
                    {index < upcomingSchedule.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>

                  <View style={styles.scheduleContent}>
                    <View style={styles.scheduleHeader}>
                      <View style={styles.scheduleInfo}>
                        <Text style={styles.scheduleTitle}>{item.title}</Text>
                        <View style={styles.scheduleDetails}>
                          <Clock size={14} color="#CCCCCC" />
                          <Text style={styles.scheduleTime}>{item.time}</Text>
                          <Text style={styles.scheduleDivider}>•</Text>
                          <Text style={styles.scheduleDate}>{item.date}</Text>
                        </View>
                      </View>
                      <View style={styles.scheduleStatus}>
                        {getStatusIcon(item.status)}
                      </View>
                    </View>

                    <View style={styles.scheduleLocation}>
                      <MapPin size={14} color="#CCCCCC" />
                      <Text style={styles.locationText}>{item.location}</Text>
                    </View>

                    {item.attendees && (
                      <View style={styles.scheduleAttendees}>
                        <User size={14} color="#CCCCCC" />
                        <Text style={styles.attendeesText}>
                          {item.attendees} attendee{item.attendees > 1 ? 's' : ''}
                        </Text>
                      </View>
                    )}

                    <View style={styles.scheduleFooter}>
                      <Text style={[styles.typeTag, { backgroundColor: `${item.color}20`, borderColor: `${item.color}40` }]}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                      <ChevronRight size={16} color="#666666" />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Playfair-Bold',
    color: '#FFFFFF',
    marginRight: 12,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeContainer: {
    alignItems: 'center',
  },
  currentDate: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  currentTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginTop: 4,
  },
  timeSlotsContainer: {
    paddingBottom: 24,
  },
  timeSlotsContent: {
    paddingHorizontal: 24,
  },
  timeSlotButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedTimeSlotButton: {
    transform: [{ scale: 1.05 }],
  },
  timeSlotBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedTimeSlotBlur: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  timeSlotText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#CCCCCC',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
  scheduleContainer: {
    flex: 1,
  },
  scheduleContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  scheduleCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  scheduleBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    flexDirection: 'row',
    padding: 16,
  },
  scheduleTimeline: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 8,
  },
  scheduleContent: {
    flex: 1,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  scheduleInfo: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scheduleDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginLeft: 4,
  },
  scheduleDivider: {
    fontSize: 12,
    color: '#CCCCCC',
    marginHorizontal: 8,
  },
  scheduleDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  scheduleStatus: {
    marginLeft: 12,
  },
  scheduleLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginLeft: 4,
  },
  scheduleAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attendeesText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
    marginLeft: 4,
  },
  scheduleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeTag: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    textTransform: 'uppercase',
  },
});