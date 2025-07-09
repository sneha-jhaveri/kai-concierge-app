# Kai Concierge App

A comprehensive AI-powered concierge application built with React Native and Expo, featuring social media analysis, personalized services, and real-time chat capabilities.

## 🚀 Features

### Core Functionality

- **Google OAuth Authentication** - Secure sign-in with Firebase
- **Social Media Integration** - Connect Instagram, Twitter, and LinkedIn
- **AI Persona Generation** - Creates detailed user profiles from social data
- **Real-time Chat** - AI-powered conversational interface with persona context
- **Personalized Services** - Dynamic service recommendations based on user persona
- **Backend Dashboard** - Admin interface for system monitoring and analytics

### Pages & Screens

#### Authentication

- **Sign-In** (`/sign-in`) - Google OAuth authentication
- **Onboarding** (`/onboarding`) - Social media connection and persona generation

#### Main App (Tab Navigation)

- **Home** (`/(tabs)/`) - Dashboard with user overview and quick actions
- **Chat** (`/(tabs)/chat`) - AI assistant with persona context injection
- **Services** (`/(tabs)/services`) - Personalized service recommendations
- **Persona** (`/(tabs)/persona`) - Quick access to persona analysis
- **Profile** (`/(tabs)/profile`) - User settings and account management
- **Schedule** (`/(tabs)/schedule`) - Calendar and appointment management

#### Analysis & Management

- **Persona Analysis** (`/persona`) - Comprehensive social media analysis with inline editing
- **Persona Storyboard** (`/persona-storyboard`) - Visual persona presentation
- **Backend Dashboard** (`/backend-dashboard`) - Admin analytics and system monitoring

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Authentication**: Firebase Auth with Google OAuth
- **Data Storage**: AsyncStorage (local storage)
- **UI Components**: Custom components with LinearGradient, BlurView
- **Icons**: Lucide React Native
- **Real-time**: Socket.io for chat functionality
- **Styling**: StyleSheet with custom design system

## 📱 API Integrations

### External APIs

1. **BrightData Social Media APIs**

   - Instagram: `https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/scrape/instagram`
   - Twitter: `https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/scrape/twitter`
   - LinkedIn: `https://v0-fork-of-brightdata-api-examples-tau.vercel.app/api/scrape/linkedin`

2. **AI Chat Backend**

   - Socket.io connection to `https://uatapi.botwot.io`
   - Persona context injection for personalized responses

3. **Persona Generation API**
   - Creates comprehensive user personas from social media data
   - Generates analytics, interests, and personality traits

### Local Storage Structure

- `userData` - User profile and connected platforms
- `socialData_instagram` - Instagram data
- `socialData_twitter` - Twitter data
- `socialData_linkedin` - LinkedIn data
- `personaData` - Generated persona information
- `chatHistory` - Chat conversation history
- `allUsers` - Multi-user support for dashboard

## 🔧 Setup & Configuration

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Google Cloud Console project
- Firebase project

### Environment Variables

Create a `.env` file with:

```
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
GOOGLE_CLIENT_ID=your_google_client_id
```

### Google OAuth Configuration

Add these redirect URIs to Google Cloud Console:

- `https://kai-concierge.netlify.app/` (Production)
- `http://localhost:8081/` (Local development)
- `http://localhost:8082/` (Local development)
- `http://localhost:8083/` (Local development)

### Installation

```bash
npm install
npm run dev
```

## 🎯 Key Features Explained

### Authentication Flow

1. User signs in with Google OAuth
2. Firebase authenticates and creates user session
3. App redirects to onboarding for social media connection

### Social Media Integration

1. User enters social media usernames/URLs
2. App fetches data from BrightData APIs
3. Data is saved to AsyncStorage
4. Persona is generated using AI analysis

### Chat System

1. User types message
2. App injects persona context into message
3. Message sent to AI backend via socket
4. AI responds with personalized answer
5. Chat history saved to AsyncStorage

### Persona Analysis

- **Content Analysis**: Post types, engagement patterns
- **Behavioral Insights**: Posting frequency, interaction style
- **Recommendations**: Growth strategies and improvements
- **Inline Editing**: Real-time editing of persona data

### Services Recommendation

- **Personalized Services**: Based on persona analysis
- **Dynamic Generation**: Adapts to user preferences
- **Fallback System**: Default services if API unavailable

### Backend Dashboard

- **User Analytics**: Total users, active sessions, connected platforms
- **System Monitoring**: Uptime, error rates, performance metrics
- **Real-time Data**: Live updates from AsyncStorage

## 🚀 Deployment

### Netlify Deployment

1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables in Netlify dashboard

### Local Development

```bash
npm run dev
# Open http://localhost:8081 (or other available port)
```

## 🔍 Debugging

### Common Issues

1. **OAuth Redirect Error**: Ensure redirect URIs match Google Cloud Console
2. **Socket Connection**: Check network connectivity and API endpoints
3. **Data Persistence**: Verify AsyncStorage permissions and data structure

### Debug Tools

- **Debug Data Button**: Available in persona analysis screen
- **Console Logging**: Comprehensive logging throughout the app
- **Test Buttons**: Available in sign-in screen for testing flows

## 📊 Analytics & Monitoring

### User Metrics

- Total users and active sessions
- Connected social media platforms
- Generated personas and chat interactions

### System Health

- Real-time system status
- Error rates and response times
- API endpoint availability

## 🔐 Security

- **OAuth 2.0**: Secure Google authentication
- **Firebase Security**: User session management
- **Local Storage**: Secure data persistence
- **API Security**: Protected external API calls

## 🎨 Design System

- **Color Scheme**: Dark theme with gold accents (#FFD700)
- **Typography**: Inter font family for modern look
- **Components**: Custom components with blur effects and gradients
- **Animations**: Smooth transitions and loading states

## 📈 Future Enhancements

- **Real-time Notifications**: Push notifications for service updates
- **Advanced Analytics**: Machine learning insights
- **Multi-language Support**: Internationalization
- **Offline Mode**: Enhanced offline capabilities
- **Payment Integration**: Service booking and payments

---

**Built with ❤️ using React Native, Expo, and Firebase**
