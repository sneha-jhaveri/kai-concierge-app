import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PersonaTab() {
  const [persona, setPersona] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const raw = await AsyncStorage.getItem('personaData');
        if (raw) {
          setPersona(JSON.parse(raw));
        }
      } catch (error) {
        console.error('Failed to load persona data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersona();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A']}
          style={styles.background}
        />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.text}>Loading persona analysis...</Text>
        </View>
      </View>
    );
  }

  if (!persona) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#0A0A0A', '#1A1A1A']}
          style={styles.background}
        />
        <View style={styles.center}>
          <Text style={styles.text}>No persona data found.</Text>
        </View>
      </View>
    );
  }

  const renderSection = (title: string, content: string[] | string) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {Array.isArray(content) ? (
        content.map((point, index) => (
          <Text key={index} style={styles.point}>
            • {point}
          </Text>
        ))
      ) : (
        <Text style={styles.block}>{content}</Text>
      )}
    </View>
  );

  const summary = persona.summary || {};
  const slides = persona.slides || {};
  const analytics = persona.analytics || {};
  const personaSummary = persona.persona_summary || {};

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A']}
        style={styles.background}
      />
      <View style={styles.wrapper}>
        <Text style={styles.title}>🧠 Persona Overview</Text>

        {renderSection('Key Insights', summary.key_insights || [])}
        {renderSection('Demographics', summary.demographics || '')}
        {renderSection('Personality', summary.personality || '')}
        {renderSection('Interests', summary.interests || '')}
        {renderSection('Shopping Behavior', summary.shopping || '')}
        {renderSection('Recommendations', summary.recommendations || '')}

        <Text style={styles.title}>📊 Analytics Breakdown</Text>
        {Object.keys(analytics).map((key) => (
          <View key={key} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {key.replace(/_/g, ' ').toUpperCase()}
            </Text>
            {Object.entries(analytics[key]).map(([k, v]) => (
              <Text key={k} style={styles.analyticsItem}>
                {k}: {String(v)}
              </Text>
            ))}
          </View>
        ))}

        <Text style={styles.title}>Persona Summary</Text>
        <View style={styles.section}>
          <Text style={styles.analyticsItem}>
            Followers: {personaSummary.followers?.toLocaleString()}
          </Text>
          <Text style={styles.analyticsItem}>
            Posts Count: {personaSummary.posts_count?.toLocaleString()}
          </Text>
          <Text style={styles.analyticsItem}>
            Avg. Engagement:{' '}
            {(personaSummary.average_engagement * 100).toFixed(2)}%
          </Text>
          <Text style={styles.analyticsItem}>
            Primary Interest: {personaSummary.primary_interest}
          </Text>
          <Text style={styles.analyticsItem}>
            Posting Frequency: {personaSummary.posting_frequency}
          </Text>
        </View>

        <Text style={styles.title}>📌 Slide Details</Text>
        {Object.entries(slides).map(([key, value]: any) => (
          <View key={key} style={styles.section}>
            <Text style={styles.sectionTitle}>{value.title}</Text>
            <Text style={styles.subtitle}>{value.subtitle}</Text>
            {value.points.map((point: string, index: number) => (
              <Text key={index} style={styles.point}>
                • {point}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A' },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wrapper: {
    paddingTop: 64,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Playfair-Bold',
    color: '#FFD700',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#BBBBBB',
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  point: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
    marginBottom: 6,
    lineHeight: 20,
  },
  block: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  analyticsItem: {
    fontSize: 13,
    color: '#AAAAAA',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
});
