// import React, { useRef } from 'react';
// import { Tabs } from 'expo-router';
// import { View, Animated, TouchableWithoutFeedback } from 'react-native';
// import { BlurView } from 'expo-blur';
// import {
//   Home,
//   MessageCircle,
//   Calendar,
//   User,
//   Sparkles,
// } from 'lucide-react-native';

// export default function TabLayout() {
//   // Animation refs for each tab
//   const animatedValues = {
//     index: useRef(new Animated.Value(1)).current,
//     services: useRef(new Animated.Value(1)).current,
//     chat: useRef(new Animated.Value(1)).current,
//     schedule: useRef(new Animated.Value(1)).current,
//     profile: useRef(new Animated.Value(1)).current,
//   };

//   // Animation function for press-in effect
//   const handlePressIn = (key: keyof typeof animatedValues) => {
//     Animated.spring(animatedValues[key], {
//       toValue: 0.9,
//       friction: 3,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Animation function for press-out effect
//   const handlePressOut = (key: keyof typeof animatedValues) => {
//     Animated.spring(animatedValues[key], {
//       toValue: 1,
//       friction: 3,
//       tension: 40,
//       useNativeDriver: true,
//     }).start();
//   };

//   // Custom TabBarIcon component with animation
//   type AnimatedTabBarIconProps = {
//     name: keyof typeof animatedValues;
//     Icon: React.ComponentType<{ size: number; color: string }>;
//     color: string;
//     size: number;
//   };

//   const AnimatedTabBarIcon: React.FC<AnimatedTabBarIconProps> = ({
//     name,
//     Icon,
//     color,
//     size,
//   }) => {
//     return (
//       <TouchableWithoutFeedback
//         onPressIn={() => handlePressIn(name)}
//         onPressOut={() => handlePressOut(name)}
//       >
//         <Animated.View
//           style={{
//             transform: [{ scale: animatedValues[name] }],
//             opacity: animatedValues[name].interpolate({
//               inputRange: [0.9, 1],
//               outputRange: [0.8, 1],
//             }),
//           }}
//         >
//           <Icon size={size} color={color} />
//         </Animated.View>
//       </TouchableWithoutFeedback>
//     );
//   };

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: {
//           position: 'absolute',
//           bottom: 0,
//           left: 0,
//           right: 0,
//           backgroundColor: 'transparent',
//           borderTopWidth: 0,
//           elevation: 0,
//           shadowOpacity: 0,
//           height: 90,
//         },
//         tabBarBackground: () => (
//           <BlurView
//             intensity={20}
//             style={{
//               flex: 1,
//               backgroundColor: 'rgba(10, 10, 10, 0.9)',
//               borderTopWidth: 1,
//               borderTopColor: 'rgba(255, 215, 0, 0.2)',
//             }}
//           />
//         ),
//         tabBarActiveTintColor: '#FFD700',
//         tabBarInactiveTintColor: '#666666',
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontFamily: 'Inter-Medium',
//           marginBottom: 8,
//         },
//         tabBarIconStyle: {
//           marginTop: 8,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Dashboard',
//           tabBarIcon: ({ color, size }) => (
//             <AnimatedTabBarIcon
//               name="index"
//               Icon={Home}
//               color={color}
//               size={size}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="services"
//         options={{
//           title: 'Services',
//           tabBarIcon: ({ color, size }) => (
//             <AnimatedTabBarIcon
//               name="services"
//               Icon={Sparkles}
//               color={color}
//               size={size}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="chat"
//         options={{
//           title: 'Chat',
//           tabBarIcon: ({ color, size }) => (
//             <AnimatedTabBarIcon
//               name="chat"
//               Icon={MessageCircle}
//               color={color}
//               size={size}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="schedule"
//         options={{
//           title: 'Schedule',
//           tabBarIcon: ({ color, size }) => (
//             <AnimatedTabBarIcon
//               name="schedule"
//               Icon={Calendar}
//               color={color}
//               size={size}
//             />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => (
//             <AnimatedTabBarIcon
//               name="profile"
//               Icon={User}
//               color={color}
//               size={size}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

import React, { useRef } from 'react';
import { Tabs } from 'expo-router';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Home,
  MessageCircle,
  Calendar,
  User,
  Sparkles,
} from 'lucide-react-native';

export default function TabLayout() {
  // Animation refs for each tab
  const animatedValues = {
    index: useRef(new Animated.Value(1)).current,
    services: useRef(new Animated.Value(1)).current,
    chat: useRef(new Animated.Value(1)).current,
    schedule: useRef(new Animated.Value(1)).current,
    profile: useRef(new Animated.Value(1)).current,
  };

  // Animation function for press-in effect
  const handlePressIn = (key: keyof typeof animatedValues) => {
    Animated.spring(animatedValues[key], {
      toValue: 0.95,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  // Animation function for press-out effect
  const handlePressOut = (key: keyof typeof animatedValues) => {
    Animated.spring(animatedValues[key], {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  // Custom TabBarIcon component with animation
  type AnimatedTabBarIconProps = {
    name: keyof typeof animatedValues;
    Icon: React.ComponentType<{ size: number; color: string }>;
    color: string;
    size: number;
  };

  const AnimatedTabBarIcon: React.FC<AnimatedTabBarIconProps> = ({
    name,
    Icon,
    color,
    size,
  }) => {
    return (
      <TouchableWithoutFeedback
        onPressIn={() => handlePressIn(name)}
        onPressOut={() => handlePressOut(name)}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Animated.View
          style={{
            transform: [{ scale: animatedValues[name] }],
            opacity: animatedValues[name].interpolate({
              inputRange: [0.95, 1],
              outputRange: [0.8, 1],
            }),
          }}
        >
          <Icon size={size} color={color} />
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 90,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={10}
            style={{
              flex: 1,
              backgroundColor: 'rgba(10, 10, 10, 0.9)',
              borderTopWidth: 1,
              borderTopColor: 'rgba(255, 215, 0, 0.2)',
            }}
          />
        ),
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
          marginBottom: 8,
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <AnimatedTabBarIcon
              name="index"
              Icon={Home}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Services',
          tabBarIcon: ({ color, size }) => (
            <AnimatedTabBarIcon
              name="services"
              Icon={Sparkles}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <AnimatedTabBarIcon
              name="chat"
              Icon={MessageCircle}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color, size }) => (
            <AnimatedTabBarIcon
              name="schedule"
              Icon={Calendar}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <AnimatedTabBarIcon
              name="profile"
              Icon={User}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
