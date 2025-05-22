import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import { supabase } from '@/lib/supabase';
import Animated, { FadeInDown } from 'react-native-reanimated';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function VisitorsListScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('visitors')
      .select('*')
      .order('visit_date', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setVisitors(data);
    }

    setLoading(false);
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', 'Could not open phone dialer')
    );
  };

  const handleText = (phone) => {
    Linking.openURL(`sms:${phone}`).catch(() =>
      Alert.alert('Error', 'Could not open messaging app')
    );
  };

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{ flex: 1, justifyContent: 'center' }} />;
  }

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 100)} style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.details}>Phone: {item.phone}</Text>
      <Text style={styles.details}>Address: {item.address}</Text>
      <Text style={styles.details}>Visit Date: {new Date(item.visit_date).toLocaleDateString()}</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.callButton} onPress={() => handleCall(item.phone)}>
          <Text style={styles.buttonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.textButton} onPress={() => handleText(item.phone)}>
          <Text style={styles.buttonText}>Text</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <FlatList
      data={visitors}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: ADMIN_COLOR,
    marginBottom: 8,
  },
  details: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    marginBottom: 4,
    color: '#495057',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  callButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  textButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
});
