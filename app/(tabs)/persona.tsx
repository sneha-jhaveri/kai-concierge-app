import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';
import { PersonaSummary } from '@/api/persona';

export default function PersonaResultScreen() {
  const params = useLocalSearchParams();
  const [summary, setSummary] = useState<PersonaSummary | null>(null);
  const [fullAnalysis, setFullAnalysis] = useState<string>('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        let parsedSummary: PersonaSummary | null = null;

        if (params.summary) {
          parsedSummary = JSON.parse(params.summary as string);
        } else {
          const stored = await AsyncStorage.getItem('personaSummary');
          if (stored) parsedSummary = JSON.parse(stored);
        }

        const defaultSummary: PersonaSummary = {
          key_insights: [],
          demographics: '',
          personality: '',
          interests: '',
          shopping: '',
          recommendations: '',
          total_sections: (parsedSummary && typeof parsedSummary.total_sections === 'number')
            ? parsedSummary.total_sections
            : 0,
          ...(parsedSummary
            ? Object.fromEntries(
                Object.entries(parsedSummary).filter(([key]) => key !== 'total_sections')
              )
            : {}),
        };

        setSummary(defaultSummary);

        const analysis = await AsyncStorage.getItem('personaFullAnalysis');
        if (analysis) setFullAnalysis(analysis);
      } catch (error) {
        console.error('Error parsing summary:', error);
        setSummary({
          key_insights: [],
          demographics: '',
          personality: '',
          interests: '',
          shopping: '',
          recommendations: '',
          total_sections: 0,
        });
      }
    };

    fetchSummary();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [params.summary]);

  if (!summary) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading persona summary...</Text>
      </View>
    );
  }

  return (
    <Animated.ScrollView style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>Your AI Persona Summary</Text>

      <Text style={styles.sectionTitle}>Key Insights</Text>
      {Array.isArray(summary.key_insights) &&
      summary.key_insights.length > 0 ? (
        summary.key_insights.map((insight, index) => (
          <Text key={index} style={styles.itemText}>
            • {insight}
          </Text>
        ))
      ) : (
        <Text style={styles.itemText}>No key insights available.</Text>
      )}

      <Text style={styles.sectionTitle}>Demographics</Text>
      <Text style={styles.itemText}>{summary.demographics || 'N/A'}</Text>

      <Text style={styles.sectionTitle}>Personality</Text>
      <Text style={styles.itemText}>{summary.personality || 'N/A'}</Text>

      <Text style={styles.sectionTitle}>Interests</Text>
      <Text style={styles.itemText}>{summary.interests || 'N/A'}</Text>

      <Text style={styles.sectionTitle}>Shopping Behavior</Text>
      <Text style={styles.itemText}>{summary.shopping || 'N/A'}</Text>

      <Text style={styles.sectionTitle}>Recommendations</Text>
      <Text style={styles.itemText}>{summary.recommendations || 'N/A'}</Text>

      {fullAnalysis ? (
        <View style={{ marginTop: 30 }}>
          <Text style={styles.sectionTitle}>Full Analysis</Text>
          <Markdown style={markdownStyles}>{fullAnalysis}</Markdown>
        </View>
      ) : null}
    </Animated.ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#0A0A0A',
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 8,
  },
  loadingText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 50,
  },
});

const markdownStyles = {
  body: { color: '#CCCCCC', fontSize: 14, lineHeight: 22 },
  heading1: { color: '#FFD700', fontSize: 22, marginVertical: 10 },
  heading2: { color: '#FFFFFF', fontSize: 18, marginVertical: 8 },
  bullet_list: { marginLeft: 10 },
  list_item: { marginBottom: 6 },
};
