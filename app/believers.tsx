import { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from '@expo-google-fonts/montserrat';
import { supabase } from '@/lib/supabase';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function BelieversListScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [believers, setBelievers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const router = useRouter();

  const fetchBelievers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('believers').select('*').order('name', { ascending: true });

    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setBelievers(data);
    }
  };

  useEffect(() => {
    fetchBelievers();
  }, []);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleText = (phone: string) => {
    Linking.openURL(`sms:${phone}`);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={ADMIN_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Believers</Text>
        <View style={styles.backButtonPlaceholder} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{ marginTop: 40 }} />
        ) : believers.length === 0 ? (
          <Text style={styles.subtitle}>No believers found.</Text>
        ) : (
          believers.map((believer, index) => (
            <Animated.View
              key={believer.id}
              entering={FadeInDown.delay(index * 100).duration(300)}
              style={styles.card}
            >
              <TouchableOpacity onPress={() => setExpandedId(expandedId === believer.id ? null : believer.id)}>
                <Text style={styles.cardName}>{believer.name} {believer.surname}</Text>
                <Text style={styles.cardDetail}>{believer.phone}</Text>
                {expandedId === believer.id && (
                  <View style={styles.actions}>
                    <TouchableOpacity onPress={() => handleCall(believer.phone)} style={styles.actionButton}>
                      <Ionicons name="call-outline" size={20} color="white" />
                      <Text style={styles.actionText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleText(believer.phone)} style={styles.actionButton}>
                      <Ionicons name="chatbox-ellipses-outline" size={20} color="white" />
                      <Text style={styles.actionText}>Text</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginTop: 30
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: ADMIN_COLOR,
  },
  backButton: {
    padding: 5,
  },
  backButtonPlaceholder: {
    width: 24,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    color: ADMIN_COLOR,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#6c757d',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  cardDetail: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
});