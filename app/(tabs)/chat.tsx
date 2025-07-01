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
  Alert,
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
import { Send, Bot, User } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hello! I'm Kai, your personal AI concierge. How can I assist you today?",
    sender: 'ai',
    timestamp: new Date(),
  },
];

const quickSuggestions = [
  'Plan a luxury weekend getaway',
  'Find me a personal stylist',
  'Book a fine dining experience',
  'Organize my digital life',
  'Plan a luxury weekend getaway',
  'Find me a personal stylist',
  'Book a fine dining experience',
  'Organize my digital life',
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const socketRef = useRef<any>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [chatRoomJoined, setChatRoomJoined] = useState(false);

  const sparkleRotation = useSharedValue(0);
  const typingOpacity = useSharedValue(0);

  const botId = '684006e942525d41443ba708';
  const userId = '6840034f42525d41443ba548';
  const userType = 'CUSTOMER';
  const applicationUrl = 'https://uatapi.botwot.io';

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

  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocketConnected(false);
      }
    };
  }, []);

  const connectSocket = async () => {
    if (
      !socketConnected &&
      (!socketRef.current || !socketRef.current.connected)
    ) {
      console.log('Connecting as CUSTOMER');
      socketRef.current = io(applicationUrl, {
        query: { isWidget: 'true', botId, userId, userType },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on('connect', () => {
        console.log('Socket connected');
        setSocketConnected(true);
      });

      socketRef.current.on('connect_error', (error: any) => {
        console.error('Socket connection error:', error);
        Alert.alert(
          'Connection Error',
          'Failed to connect to the server. Please check your internet connection and try again.'
        );
      });

      socketRef.current.on(
        'sessionCreated',
        async (data: { sessionId: string }) => {
          console.log('SessionId in widget', data.sessionId);
          await AsyncStorage.setItem('sessionId', data.sessionId);
          joinChatRoom();
        }
      );

      socketRef.current.on('messageToClient', (data: any) => {
        console.log('Data in widget', data);
        if (data.sessionId) {
          AsyncStorage.setItem('sessionId', data.sessionId);
        }

        if (data.messageType === 'text' && data.response) {
          const aiMessage: Message = {
            id: Date.now().toString(),
            text: data.response,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          setIsTyping(false);
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      });

      socketRef.current.on('handlerChanged', (data: { newHandler: string }) => {
        const messageText =
          data.newHandler === 'agent'
            ? 'A support agent has joined the conversation.'
            : 'Conversation is now handled by AI assistant.';
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: messageText,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMessage]);
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });

      socketRef.current.on(
        'adminEndedSession',
        (data: { message?: string }) => {
          const messageText =
            data.message ||
            'This session has ended. Please start a new session to continue chatting.';
          const aiMessage: Message = {
            id: Date.now().toString(),
            text: messageText,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          setInputText('');
          scrollViewRef.current?.scrollToEnd({ animated: true });
          const newSessionMessage: Message = {
            id: Date.now().toString() + '-new-session',
            text: 'Tap here to start a new session.',
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, newSessionMessage]);
        }
      );

      socketRef.current.on('errorResponse', (message: string) => {
        if (message.includes('session is already closed')) {
          const aiMessage: Message = {
            id: Date.now().toString(),
            text: message,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
          scrollViewRef.current?.scrollToEnd({ animated: true });
          const newSessionMessage: Message = {
            id: Date.now().toString() + '-new-session',
            text: 'Tap here to start a new session.',
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, newSessionMessage]);
        }
      });
    } else {
      console.log('Socket already connected');
    }
  };

  const joinChatRoom = async () => {
    if (!chatRoomJoined) {
      const sessionId = await AsyncStorage.getItem('sessionId');
      if (sessionId && socketRef.current) {
        socketRef.current.emit('joinSession', {
          botId,
          userId,
          userType,
          sessionId,
        });
        console.log(
          'Joined room in widget',
          userType,
          botId,
          userId,
          sessionId
        );
        setChatRoomJoined(true);
      } else {
        console.log('Cannot join chat room: sessionId not available yet.');
      }
    }
  };

  const messageToServer = async (message: string, messageType = 'text') => {
    const sessionId = await AsyncStorage.getItem('sessionId');
    if (sessionId && socketRef.current && socketRef.current.connected) {
      const payload = {
        botId,
        userId,
        userType,
        sessionId,
        message,
        messageType,
      };
      socketRef.current.emit('messageToServer', payload);
      console.log('Sending to server:', payload);
    } else {
      Alert.alert('Error', 'Not connected to the server. Please try again.');
      await startNewSession();
    }
  };

  const startNewSession = async () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      setSocketConnected(false);
      setChatRoomJoined(false);
    }
    await AsyncStorage.removeItem('sessionId');
    setMessages([...initialMessages]);
    setInputText('');
    connectSocket();
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    scrollViewRef.current?.scrollToEnd({ animated: true });

    await messageToServer(text);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleMessagePress = (message: Message) => {
    if (message.text === 'Tap here to start a new session.') {
      startNewSession();
    }
  };

  // Define animated styles
  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const typingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: typingOpacity.value,
  }));

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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust offset for navigation bar
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
            onContentSizeChange={() =>
              scrollViewRef.current?.scrollToEnd({ animated: true })
            }
          >
            {messages.map((message) => (
              <TouchableOpacity
                key={message.id}
                style={[
                  styles.messageContainer,
                  message.sender === 'user'
                    ? styles.userMessage
                    : styles.aiMessage,
                ]}
                onPress={() => handleMessagePress(message)}
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
                    message.sender === 'user'
                      ? styles.userMessageBlur
                      : styles.aiMessageBlur,
                    message.sender === 'user'
                      ? styles.userMessageBlur
                      : styles.aiMessageBlur,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user'
                        ? styles.userMessageText
                        : styles.aiMessageText,
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
              </TouchableOpacity>
            ))}

            {isTyping && (
              <Animated.View
                style={[styles.typingContainer, typingAnimatedStyle]}
              >
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
          {messages.length <= 2 && (
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
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.sendButtonDisabled,
                ]}
                onPress={() => sendMessage(inputText)}
                disabled={!inputText.trim()}
              >
                <Send
                  size={20}
                  color={inputText.trim() ? '#0A0A0A' : '#666666'}
                />
              </TouchableOpacity>
            </BlurView>
          </View>
        </KeyboardAvoidingView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Services</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Text style={styles.navText}>Profile</Text>
          </TouchableOpacity>
        </View>
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
    padding: 16,
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
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  messageBlur: {
    maxWidth: width * 0.7,
    borderRadius: 16,
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
    lineHeight: 20,
    padding: 12,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#FFFFFF',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  typingBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 12,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginHorizontal: 2,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  suggestionButton: {
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  suggestionBlur: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  suggestionText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  inputContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  inputBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    maxHeight: 80,
    marginRight: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 215, 0, 0.2)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#CCCCCC',
    fontSize: 12,
  },
});
