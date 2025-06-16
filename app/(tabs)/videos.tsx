import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  Linking,
  ActivityIndicator
} from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

const PRIMARY_COLOR = '#6a1b9a';

export default function ChurchConnectScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [user, setUser] = useState(null);
  const [professions, setProfessions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [professionCount, setProfessionCount] = useState(0);
  const [hasProfession, setHasProfession] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (currentUser) {
          setUser(currentUser);
          await fetchProfessions();
          await checkUserProfession(currentUser.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchProfessions = async () => {
    try {
      const { count } = await supabase
        .from('professions')
        .select('*', { count: 'exact', head: true });
      setProfessionCount(count || 0);

      const { data, error } = await supabase
        .from('professions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfessions(data || []);
    } catch (error) {
      console.error('Error fetching professions:', error);
    }
  };

  const checkUserProfession = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('professions')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHasProfession(!!data);
    } catch (error) {
      console.error('Error checking user profession:', error);
    }
  };

  const handleShowProfessionModal = () => {
    if (!user) {
      Alert.alert('Authentication Required', 'Please sign in to add your profession');
      return;
    }
    
    if (hasProfession) {
      Alert.alert('Already Added', 'You have already added your profession');
      return;
    }
    router.push('/add-profession');
  };

  const handleCall = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const filteredProfessions = professions.filter(prof => 
    prof.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prof.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (prof.business_name && prof.business_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!fontsLoaded) return null;

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <View style={styles.header}>
          <Text style={styles.title}>Church Connect</Text>
          <Text style={styles.subtitle}>Connect through professions</Text>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(200)}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: PRIMARY_COLOR }]}
          onPress={handleShowProfessionModal}
        >
          <FontAwesome name="briefcase" size={20} color="white" />
          <Text style={styles.actionButtonText}>
            {hasProfession ? 'Profession Added' : 'Add My Profession'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(500).delay(300)}>
        <Text style={styles.sectionTitle}>Profession Members ({professionCount})</Text>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search professions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FlatList
          scrollEnabled={false}
          data={filteredProfessions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.professionCard}>
              <View style={styles.professionHeader}>
                <View style={styles.professionIcon}>
                  <FontAwesome name="user" size={20} color={PRIMARY_COLOR} />
                </View>
                <View style={styles.professionTitleContainer}>
                  <Text style={styles.professionName}>
                    {item.first_name} {item.last_name}
                  </Text>
                  <Text style={styles.professionTitle}>{item.profession}</Text>
                  {item.business_name && (
                    <Text style={styles.professionBusiness}>{item.business_name}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.contactInfo}>
                {item.phone && (
                  <TouchableOpacity 
                    style={styles.contactButton} 
                    onPress={() => handleCall(item.phone)}
                  >
                    <FontAwesome name="phone" size={16} color={PRIMARY_COLOR} />
                    <Text style={styles.contactText}>{item.phone}</Text>
                  </TouchableOpacity>
                )}
                
                {item.email && (
                  <TouchableOpacity 
                    style={styles.contactButton} 
                    onPress={() => handleEmail(item.email)}
                  >
                    <FontAwesome name="envelope" size={16} color={PRIMARY_COLOR} />
                    <Text style={styles.contactText}>{item.email}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No professions found</Text>
          }
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    marginTop: 30
  },
  title: {
    fontSize: 28,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#757575',
  },
  sectionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: '#333',
    marginTop: 24,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: 'white',
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Montserrat_400Regular',
  },
  professionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  professionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  professionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  professionTitleContainer: {
    flex: 1,
  },
  professionName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  professionTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: PRIMARY_COLOR,
    marginBottom: 2,
  },
  professionBusiness: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#757575',
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    marginTop: 10,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  contactText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  emptyText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  loaderText: {
    marginTop: 10,
    fontFamily: 'Montserrat_400Regular',
    color: PRIMARY_COLOR,
  },
});