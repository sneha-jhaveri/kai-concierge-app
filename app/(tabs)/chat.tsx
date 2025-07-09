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

interface PersonaData {
  full_analysis?: string;
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
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
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

  // ✅ NEW EFFECT TO JOIN CHAT ROOM
  useEffect(() => {
    if (socketConnected && !chatRoomJoined) {
      joinChatRoom();
    }
  }, [socketConnected, chatRoomJoined]);

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
    loadPersonaData();
    loadChatHistory();
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        setSocketConnected(false);
      }
    };
  }, []);

  const loadPersonaData = async () => {
    try {
      const personaDataRaw = await AsyncStorage.getItem('personaData');
      if (personaDataRaw) {
        const parsed = JSON.parse(personaDataRaw);
        setPersonaData(parsed);
        console.log('✅ Loaded persona data for chat:', parsed);
      }
    } catch (error) {
      console.error('Error loading persona data:', error);
    }
  };

  const loadChatHistory = async () => {
    try {
      const chatHistoryRaw = await AsyncStorage.getItem('chatHistory');
      if (chatHistoryRaw) {
        const chatHistory = JSON.parse(chatHistoryRaw);
        const parsedMessages = chatHistory.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages([...initialMessages, ...parsedMessages]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    try {
      const messagesForStorage = newMessages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      }));
      await AsyncStorage.setItem(
        'chatHistory',
        JSON.stringify(messagesForStorage)
      );
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  };

  const connectSocket = async () => {
    try {
      console.log('🔌 Connecting as CUSTOMER to:', applicationUrl);

      socketRef.current = io(applicationUrl, {
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socketRef.current.on('connect', () => {
        console.log('✅ Socket connected successfully');
        setSocketConnected(true); // Do not call hooks or side effects here
      });

      socketRef.current.on('connect_error', (error: any) => {
        console.error('❌ Socket connection error:', error);
        setSocketConnected(false);
        Alert.alert(
          'Connection Error',
          'Failed to connect to the server. Please check your internet connection and try again.'
        );
      });

      socketRef.current.on('disconnect', (reason: string) => {
        console.log('🔌 Socket disconnected:', reason);
        setSocketConnected(false);
        setChatRoomJoined(false);
      });

      socketRef.current.on('message', (data: any) => {
        console.log('📨 Received message:', data);
        if (data.type === 'bot_response') {
          const botMessage: Message = {
            id: Date.now().toString(),
            text: data.message,
            sender: 'ai',
            timestamp: new Date(),
          };
          setMessages((prev) => {
            const updated = [...prev, botMessage];
            saveChatHistory(updated);
            return updated;
          });
          setIsTyping(false);
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      });

      socketRef.current.on('error', (error: any) => {
        console.error('❌ Socket error:', error);
        Alert.alert('Error', 'Connection error occurred');
      });
    } catch (error) {
      console.error('❌ Error connecting socket:', error);
      setSocketConnected(false);
    }
  };

  const joinChatRoom = async () => {
    if (socketRef.current && socketConnected) {
      try {
        const sessionId = await AsyncStorage.getItem('sessionId');
        if (sessionId) {
          console.log('🎯 Joining chat room with sessionId:', sessionId);
          socketRef.current.emit('joinChatRoom', { sessionId });
          setChatRoomJoined(true);
        } else {
          console.log('🆕 No sessionId found, starting new session');
          startNewSession();
        }
      } catch (error) {
        console.error('❌ Error joining chat room:', error);
        startNewSession();
      }
    } else {
      console.log('❌ Socket not ready to join chat room yet');
    }
  };

  const startNewSession = async () => {
    if (socketRef.current && socketConnected) {
      try {
        const sessionData = {
          botId,
          userId,
          userType,
        };

        console.log('🆕 Starting new session with:', sessionData);

        socketRef.current.emit(
          'startSession',
          sessionData,
          async (response: any) => {
            if (response?.sessionId) {
              console.log('✅ Session created with ID:', response.sessionId);
              await AsyncStorage.setItem('sessionId', response.sessionId);
              setChatRoomJoined(true);
            } else {
              console.error('❌ Failed to create session:', response);
            }
          }
        );
      } catch (error) {
        console.error('❌ Error starting new session:', error);
      }
    } else {
      console.log('❌ Socket not ready for starting session');
    }
  };

  const messageToServer = async (message: string, messageType = 'text') => {
    if (!socketRef.current || !socketConnected) {
      console.error('❌ Socket not connected');
      Alert.alert('Error', 'Chat connection not available. Please try again.');
      return;
    }

    if (!chatRoomJoined) {
      console.log('🔄 No chat room joined, starting new session');
      await startNewSession();
      // Wait a bit for session to be established
      setTimeout(() => {
        if (chatRoomJoined) {
          sendMessageToSocket(message, messageType);
        } else {
          console.error('❌ Still not joined to chat room');
          Alert.alert('Error', 'Unable to join chat room. Please try again.');
        }
      }, 1000);
      return;
    }

    sendMessageToSocket(message, messageType);
  };

  const sendMessageToSocket = (message: string, messageType = 'text') => {
    if (!socketRef.current || !socketConnected || !chatRoomJoined) {
      console.error('❌ Socket not ready:', {
        socket: !!socketRef.current,
        connected: socketConnected,
        joined: chatRoomJoined,
      });
      return;
    }

    try {
      // ✅ Use already-loaded personaData
      let personaContext = '';
      if (personaData?.full_analysis) {
        personaContext = personaData.full_analysis;
      }

      const messageData = {
        message,
        messageType,
        personaContext,
        timestamp: new Date().toISOString(),
      };

      console.log('📝 Sending message to socket:', messageData);
      socketRef.current?.emit('message', messageData);

      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      saveChatHistory([...messages, userMessage]);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const sendMessage = async (text: string) => {
    if (text.trim() && socketRef.current && socketConnected) {
      console.log('📝 Sending message:', text);
      const userMessage: Message = {
        id: Date.now().toString(),
        text: text.trim(),
        sender: 'user',
        timestamp: new Date(),
      };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      saveChatHistory(newMessages);
      setInputText('');
      setIsTyping(true);
      scrollViewRef.current?.scrollToEnd({ animated: true });

      try {
        await messageToServer(text.trim());
      } catch (error) {
        console.error('❌ Error sending message:', error);
        setIsTyping(false);
        const errorMessage: Message = {
          id: Date.now().toString(),
          text: 'Failed to send message. Please try again.',
          sender: 'ai',
          timestamp: new Date(),
        };
        const finalMessages = [...newMessages, errorMessage];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      }
    } else {
      console.log('❌ Cannot send message:', {
        hasText: !!text.trim(),
        hasSocket: !!socketRef.current,
        isConnected: socketConnected,
      });
    }
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
                    key={`suggestion-${index}-${suggestion.substring(0, 10)}`}
                    style={styles.suggestionButton}
                    onPress={() => handleQuickSuggestion(suggestion)}
                  >
                    <BlurView intensity={15} style={styles.suggestionBlur}>
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </BlurView>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[styles.suggestionButton, { marginTop: 8 }]}
                onPress={() => {
                  console.log('🔍 Connection status:', {
                    socketConnected,
                    hasSocket: !!socketRef.current,
                    sessionId: AsyncStorage.getItem('sessionId'),
                  });
                  Alert.alert(
                    'Connection Status',
                    `Socket: ${socketConnected ? 'Connected' : 'Disconnected'}`
                  );
                }}
              >
                <BlurView intensity={15} style={styles.suggestionBlur}>
                  <Text style={styles.suggestionText}>Test Connection</Text>
                </BlurView>
              </TouchableOpacity>
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
