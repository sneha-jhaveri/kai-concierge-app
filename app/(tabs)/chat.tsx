import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Send, Bot, User, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm Kai, your personal AI concierge. I've analyzed your social media profiles and I'm ready to help you with luxury travel, personal shopping, and lifestyle management. What would you like to explore today?",
    sender: 'ai',
    timestamp: new Date(),
  },
];

const quickSuggestions = [
  "Plan a luxury weekend getaway",
  "Find me a personal stylist",
  "Book a fine dining experience",
  "Organize my digital life",
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const sparkleRotation = useSharedValue(0);
  const typingOpacity = useSharedValue(0);

  useEffect(() => {
    sparkleRotation.value = withRepeat(
      withSequence(
        withSpring(360, { duration: 4000 }),
        withSpring(0, { duration: 4000 })
      ),
      -1
    );
  }, []);

  useEffect(() => {
    if (isTyping) {
      typingOpacity.value = withSpring(1);
    } else {
      typingOpacity.value = withSpring(0);
    }
  }, [isTyping]);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const typingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: typingOpacity.value,
  }));

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userText: string): string => {
    const responses = [
      "I'd be delighted to help you with that! Based on your profile, I can see you appreciate luxury experiences. Let me curate some exclusive options for you.",
      "Excellent choice! I've identified some premium opportunities that align with your sophisticated taste. Would you like me to proceed with the arrangements?",
      "Perfect! I can leverage my connections to secure exclusive access and personalized service for you. Let me handle all the details.",
      "Wonderful! I'll craft a bespoke experience that reflects your refined preferences. I'll take care of everything to ensure it exceeds your expectations.",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleQuickSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#0A0A0A']}
        style={styles.backgroundGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.aiAvatarContainer}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.aiAvatar}
                >
                  <Animated.View style={sparkleAnimatedStyle}>
                    <Bot size={24} color="#0A0A0A" />
                  </Animated.View>
                </LinearGradient>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Kai Concierge</Text>
                <Text style={styles.headerSubtitle}>Your AI Assistant</Text>
              </View>
            </View>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.sender === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                {message.sender === 'ai' && (
                  <View style={styles.messageAvatar}>
                    <Bot size={16} color="#0A0A0A" />
                  </View>
                )}
                
                <BlurView
                  intensity={15}
                  style={[
                    styles.messageBlur,
                    message.sender === 'user' ? styles.userMessageBlur : styles.aiMessageBlur,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userMessageText : styles.aiMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </BlurView>

                {message.sender === 'user' && (
                  <View style={styles.messageAvatar}>
                    <User size={16} color="#FFD700" />
                  </View>
                )}
              </View>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <Animated.View style={[styles.typingContainer, typingAnimatedStyle]}>
                <View style={styles.messageAvatar}>
                  <Bot size={16} color="#0A0A0A" />
                </View>
                <BlurView intensity={15} style={styles.typingBlur}>
                  <View style={styles.typingDots}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </BlurView>
              </Animated.View>
            )}
          </ScrollView>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsTitle}>Quick Suggestions</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {quickSuggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionButton}
                    onPress={() => handleQuickSuggestion(suggestion)}
                  >
                    <BlurView intensity={15} style={styles.suggestionBlur}>
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Input */}
          <View style={styles.inputContainer}>
            <BlurView intensity={20} style={styles.inputBlur}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask Kai anything..."
                placeholderTextColor="#666666"
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
              >
                <Send size={20} color={inputText.trim() ? "#0A0A0A" : "#666666"} />
              </TouchableOpacity>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiAvatarContainer: {
    marginRight: 12,
  },
  aiAvatar: {
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
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CCCCCC',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBlur: {
    maxWidth: width * 0.75,
    borderRadius: 20,
    overflow: 'hidden',
  },
  userMessageBlur: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
  },
  aiMessageBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    padding: 16,
  },
  userMessageText: {
    color: '#0A0A0A',
  },
  aiMessageText: {
    color: '#FFFFFF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  typingBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 16,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFD700',
    marginHorizontal: 2,
  },
  suggestionsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  suggestionButton: {
    marginRight: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  suggestionBlur: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  suggestionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  inputContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  inputBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
});