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
      if (params.summary) {
        const parsed = JSON.parse(params.summary as string);
        setSummary(parsed);
        const storedAnalysis = await AsyncStorage.getItem(
          'personaFullAnalysis'
        );
        if (storedAnalysis) setFullAnalysis(storedAnalysis);
      } else {
        const stored = await AsyncStorage.getItem('personaSummary');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSummary(parsed);
        }
        const analysis = await AsyncStorage.getItem('personaFullAnalysis');
        if (analysis) setFullAnalysis(analysis);
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
      {summary.key_insights.map((insight, index) => (
        <Text key={index} style={styles.itemText}>
          • {insight}
        </Text>
      ))}

      <Text style={styles.sectionTitle}>Demographics</Text>
      <Text style={styles.itemText}>{summary.demographics}</Text>

      <Text style={styles.sectionTitle}>Personality</Text>
      <Text style={styles.itemText}>{summary.personality}</Text>

      <Text style={styles.sectionTitle}>Interests</Text>
      <Text style={styles.itemText}>{summary.interests}</Text>

      <Text style={styles.sectionTitle}>Shopping Behavior</Text>
      <Text style={styles.itemText}>{summary.shopping}</Text>

      <Text style={styles.sectionTitle}>Recommendations</Text>
      <Text style={styles.itemText}>{summary.recommendations}</Text>

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
