// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Animated,
//   Easing,
//   Dimensions,
// } from 'react-native';
// import { useLocalSearchParams } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Markdown from 'react-native-markdown-display';
// import { PieChart, BarChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// export default function PersonaResultScreen() {
//   const params = useLocalSearchParams();
//   const [summary, setSummary] = useState<any>(null);
//   const [fullAnalysis, setFullAnalysis] = useState<string>('');
//   const fadeAnim = useState(new Animated.Value(0))[0];

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         let parsed: any = null;
//         if (params.summary) {
//           parsed = JSON.parse(params.summary as string);
//         } else {
//           const stored = await AsyncStorage.getItem('personaSummary');
//           if (stored) parsed = JSON.parse(stored);
//         }

//         setSummary(parsed || null);

//         const analysis = await AsyncStorage.getItem('personaFullAnalysis');
//         if (analysis) setFullAnalysis(analysis);
//       } catch (error) {
//         console.error('Error parsing summary:', error);
//         setSummary(null);
//       }
//     };

//     fetchSummary();

//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1000,
//       easing: Easing.out(Easing.exp),
//       useNativeDriver: true,
//     }).start();
//   }, [params.summary]);

//   if (!summary) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.loadingText}>Loading persona summary...</Text>
//       </View>
//     );
//   }

//   return (
//     <Animated.ScrollView
//       style={{ flex: 1, backgroundColor: '#0A0A0A', opacity: fadeAnim }}
//       contentContainerStyle={styles.scrollContent}
//     >
//       <Text style={styles.sectionTitle}>Summary</Text>
//       {summary?.summary?.key_insights ? (
//         typeof summary.summary.key_insights === 'object' ? (
//           Array.isArray(summary.summary.key_insights) ? (
//             summary.summary.key_insights.map((point: string, i: number) => (
//               <Text key={i} style={styles.itemText}>
//                 • {point}
//               </Text>
//             ))
//           ) : (
//             Object.entries(summary.summary.key_insights).map(
//               ([key, value], i) => (
//                 <Text key={i} style={styles.itemText}>
//                   • {capitalize(key.replace(/_/g, ' '))}: {String(value)}
//                 </Text>
//               )
//             )
//           )
//         ) : (
//           <Text style={styles.itemText}>
//             • {String(summary.summary.key_insights)}
//           </Text>
//         )
//       ) : (
//         <Text style={styles.itemText}>No summary data available.</Text>
//       )}

//       {fullAnalysis ? (
//         <View style={{ marginTop: 30 }}>
//           <Text style={styles.sectionTitle}>Full Analysis</Text>
//           <Markdown style={markdownStyles}>{fullAnalysis}</Markdown>
//         </View>
//       ) : null}

//       {summary?.analytics && (
//         <View style={{ marginTop: 30 }}>
//           <Text style={styles.sectionTitle}>Analytics Dashboard</Text>

//           {/* Interests */}
//           <Text style={styles.itemText}>Interests Distribution</Text>
//           <PieChart
//             data={createPieData(
//               summary.analytics.interests,
//               (i) => `hsl(${i * 36}, 70%, 50%)`
//             )}
//             width={screenWidth - 40}
//             height={180}
//             chartConfig={chartConfig}
//             accessor="population"
//             backgroundColor="transparent"
//             paddingLeft="10"
//           />

//           {/* Personality Traits */}
//           <Text style={[styles.itemText, { marginTop: 20 }]}>
//             Personality Traits
//           </Text>
//           <BarChart
//             data={createBarData(summary.analytics.personality_traits)}
//             width={screenWidth - 40}
//             height={220}
//             chartConfig={chartConfig}
//             verticalLabelRotation={30}
//             fromZero
//             yAxisLabel={''}
//             yAxisSuffix={''}
//           />

//           {/* Content Types */}
//           <Text style={[styles.itemText, { marginTop: 20 }]}>
//             Content Types
//           </Text>
//           <PieChart
//             data={createPieData(
//               summary.analytics.content_types,
//               (i) => `hsl(${i * 40}, 60%, 50%)`
//             )}
//             width={screenWidth - 40}
//             height={180}
//             chartConfig={chartConfig}
//             accessor="population"
//             backgroundColor="transparent"
//             paddingLeft="10"
//           />

//           {/* Engagement Style */}
//           <Text style={[styles.itemText, { marginTop: 20 }]}>
//             Engagement Style
//           </Text>
//           <BarChart
//             data={createBarData(summary.analytics.engagement_style)}
//             width={screenWidth - 40}
//             height={220}
//             chartConfig={chartConfig}
//             verticalLabelRotation={30}
//             fromZero
//             yAxisLabel={''}
//             yAxisSuffix={''}
//           />

//           {/* Shopping Behavior */}
//           <Text style={[styles.itemText, { marginTop: 20 }]}>
//             Shopping Behavior
//           </Text>
//           <BarChart
//             data={createBarData(summary.analytics.shopping_behavior)}
//             width={screenWidth - 40}
//             height={220}
//             chartConfig={chartConfig}
//             verticalLabelRotation={30}
//             fromZero
//             yAxisLabel={''}
//             yAxisSuffix={''}
//           />
//         </View>
//       )}
//     </Animated.ScrollView>
//   );
// }

// const capitalize = (s: string) =>
//   s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// const createPieData = (
//   data: Record<string, number>,
//   colorFn: (index: number) => string
// ) => {
//   return Object.entries(data).map(([key, value], index) => ({
//     name: capitalize(key),
//     population: value,
//     color: colorFn(index),
//     legendFontColor: '#CCCCCC',
//     legendFontSize: 12,
//   }));
// };

// const createBarData = (data: Record<string, number>) => ({
//   labels: Object.keys(data).map((k) => capitalize(k)),
//   datasets: [{ data: Object.values(data) }],
// });

// const chartConfig = {
//   backgroundGradientFrom: '#0A0A0A',
//   backgroundGradientTo: '#0A0A0A',
//   color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
//   labelColor: () => '#CCCCCC',
//   strokeWidth: 2,
//   barPercentage: 0.6,
//   decimalPlaces: 0,
// };

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#0A0A0A',
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: '#FFFFFF',
//     fontWeight: '600',
//     marginTop: 20,
//     marginBottom: 8,
//   },
//   itemText: {
//     fontSize: 14,
//     color: '#CCCCCC',
//     lineHeight: 20,
//     marginBottom: 8,
//   },
//   loadingText: {
//     color: '#FFF',
//     textAlign: 'center',
//     marginTop: 50,
//   },
// });

// const markdownStyles = {
//   body: { color: '#CCCCCC', fontSize: 14, lineHeight: 22 },
//   heading1: { color: '#FFD700', fontSize: 22, marginVertical: 10 },
//   heading2: { color: '#FFFFFF', fontSize: 18, marginVertical: 8 },
//   bullet_list: { marginLeft: 10 },
//   list_item: { marginBottom: 6 },
// };

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown from 'react-native-markdown-display';
import { PieChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function PersonaResultScreen() {
  const params = useLocalSearchParams();
  const [summary, setSummary] = useState<any>(null);
  const [fullAnalysis, setFullAnalysis] = useState<string>('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        let parsed: any = null;
        if (params.summary) {
          parsed = JSON.parse(params.summary as string);
        } else {
          const stored = await AsyncStorage.getItem('personaSummary');
          if (stored) parsed = JSON.parse(stored);
        }

        setSummary(parsed || null);

        const analysis = await AsyncStorage.getItem('personaFullAnalysis');
        if (analysis) setFullAnalysis(analysis);
      } catch (error) {
        console.error('Error parsing summary:', error);
        setSummary(null);
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
    <Animated.ScrollView
      style={{ flex: 1, backgroundColor: '#0A0A0A', opacity: fadeAnim }}
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.header}>Persona Overview</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Persona Summary</Text>
        <Text style={styles.itemText}>
          👥 Followers: {summary.summary.followers?.toLocaleString?.() ?? 'N/A'}
        </Text>
        <Text style={styles.itemText}>
          📈 Posts Count: {summary.summary.posts_count ?? 'N/A'}
        </Text>
        <Text style={styles.itemText}>
          📊 Avg. Engagement:{' '}
          {(summary.summary.average_engagement * 100).toFixed(2)}%
        </Text>
        <Text style={styles.itemText}>
          🔥 Primary Interest: {summary.summary.primary_interest}
        </Text>
        <Text style={styles.itemText}>
          ⏰ Posting Frequency: {summary.summary.posting_frequency}
        </Text>
        <Text style={styles.itemText}>
          🌍 Demographics: {summary.summary.demographics}
        </Text>
        <Text style={styles.itemText}>
          💡 Personality: {summary.summary.personality}
        </Text>
        <Text style={styles.itemText}>
          🎯 Interests: {summary.summary.interests}
        </Text>
        <Text style={styles.itemText}>
          🛍️ Shopping Behavior: {summary.summary.shopping}
        </Text>
        <Text style={styles.itemText}>
          🤝 Recommendations: {summary.summary.recommendations}
        </Text>
      </View>

      {/* Summary Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        {summary?.summary?.key_insights ? (
          typeof summary.summary.key_insights === 'object' ? (
            Array.isArray(summary.summary.key_insights) ? (
              summary.summary.key_insights.map((point: string, i: number) => (
                <Text key={i} style={styles.itemText}>
                  • {point}
                </Text>
              ))
            ) : (
              Object.entries(summary.summary.key_insights).map(
                ([key, value], i) => (
                  <Text key={i} style={styles.itemText}>
                    • {capitalize(key)}: {String(value)}
                  </Text>
                )
              )
            )
          ) : (
            <Text style={styles.itemText}>
              • {String(summary.summary.key_insights)}
            </Text>
          )
        ) : (
          <Text style={styles.itemText}>No summary data available.</Text>
        )}
      </View>

      {/* Full Analysis */}
      {fullAnalysis ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Full Analysis</Text>
          <Markdown style={markdownStyles}>{fullAnalysis}</Markdown>
        </View>
      ) : null}

      {/* Analytics Dashboard */}
      {summary?.analytics && (
        <View style={[styles.card, { marginBottom: 40 }]}>
          <Text style={styles.sectionTitle}>Analytics Dashboard</Text>

          <ChartBlock title="Interests Distribution">
            <PieChart
              data={createPieData(
                summary.analytics.interests,
                (i) => `hsl(${i * 36}, 70%, 50%)`
              )}
              width={screenWidth - 80}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </ChartBlock>

          <ChartBlock title="Personality Traits">
            <BarChart
              data={createBarData(summary.analytics.personality_traits)}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero
              yAxisLabel={''}
              yAxisSuffix={''}
            />
          </ChartBlock>

          <ChartBlock title="Content Types">
            <PieChart
              data={createPieData(
                summary.analytics.content_types,
                (i) => `hsl(${i * 30}, 60%, 50%)`
              )}
              width={screenWidth - 80}
              height={180}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </ChartBlock>

          <ChartBlock title="Engagement Style">
            <BarChart
              data={createBarData(summary.analytics.engagement_style)}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero
              yAxisLabel={''}
              yAxisSuffix={''}
            />
          </ChartBlock>

          <ChartBlock title="Shopping Behavior">
            <BarChart
              data={createBarData(summary.analytics.shopping_behavior)}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero
              yAxisLabel={''}
              yAxisSuffix={''}
            />
          </ChartBlock>
        </View>
      )}
    </Animated.ScrollView>
  );
}

const ChartBlock = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={{ marginTop: 24 }}>
    <Text style={styles.chartTitle}>{title}</Text>
    {children}
  </View>
);

const capitalize = (s: string) =>
  s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const createPieData = (
  data: Record<string, number>,
  colorFn: (index: number) => string
) => {
  return Object.entries(data).map(([key, value], index) => ({
    name: capitalize(key),
    population: value,
    color: colorFn(index),
    legendFontColor: '#CCCCCC',
    legendFontSize: 12,
  }));
};

const createBarData = (data: Record<string, number>) => ({
  labels: Object.keys(data).map((k) => capitalize(k)),
  datasets: [{ data: Object.values(data) }],
});

const chartConfig = {
  backgroundGradientFrom: '#0A0A0A',
  backgroundGradientTo: '#0A0A0A',
  color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
  labelColor: () => '#CCCCCC',
  strokeWidth: 2,
  barPercentage: 0.6,
  decimalPlaces: 0,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0A0A0A',
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 26,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 6,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  loadingText: {
    color: '#FFF',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

const markdownStyles = {
  body: { color: '#CCCCCC', fontSize: 14, lineHeight: 22 },
  heading1: { color: '#FFD700', fontSize: 22, marginVertical: 10 },
  heading2: { color: '#FFFFFF', fontSize: 18, marginVertical: 8 },
  bullet_list: { marginLeft: 10 },
  list_item: { marginBottom: 6 },
};
