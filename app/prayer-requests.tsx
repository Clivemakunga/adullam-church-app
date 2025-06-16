import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { supabase } from '@/lib/supabase';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function PrayerRequestsScreen() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchPrivatePrayers = async () => {
    try {
      setLoading(true);
      
      // Fetch prayer requests
      const { data: prayerRequests, error: prayerError } = await supabase
        .from('prayer_requests')
        .select('*')
        .eq('is_private', true)
        .order('created_at', { ascending: false });

      if (prayerError) throw prayerError;

      // Get all unique user IDs
      const userIds = [...new Set(prayerRequests.map(p => p.user_id))];

      // Fetch user data in one query
      const { data: users, error: userError } = await supabase
        .from('users')
        .select('id, first_name, image')
        .in('id', userIds);

      if (userError) throw userError;

      // Combine the data
      const formattedPrayers = prayerRequests.map(prayer => {
        const user = users.find(u => u.id === prayer.user_id);
        return {
          id: prayer.id,
          name: user?.first_name || "Anonymous",
          date: prayer.status ? prayer.updated_at || prayer.created_at : prayer.created_at,
          request: prayer.content,
          status: prayer.status || false,
          avatar: user?.image,
          category: "private"
        };
      });

      setPrayers(formattedPrayers);
    } catch (error) {
      console.error('Error fetching private prayers:', error);
      Alert.alert("Error", "Failed to load prayers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivatePrayers();
  }, []);

  const markAsPrayed = async (id) => {
    try {
      setLoading(true);
      
      // First check if the prayer exists and isn't already prayed for
      const { data: existingPrayer, error: fetchError } = await supabase
        .from('prayer_requests')
        .select('id, status')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!existingPrayer) throw new Error("Prayer request not found");
      if (existingPrayer.status) {
        // Already prayed for - just update local state
        setPrayers(prayers.map(p => 
          p.id === id ? {...p, status: true} : p
        ));
        return;
      }

      // Perform the update without expecting data back
      const { error: updateError } = await supabase
        .from('prayer_requests')
        .update({ 
          status: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // Optimistic update
      setPrayers(prayers.map(prayer => 
        prayer.id === id ? { 
          ...prayer, 
          status: true,
          date: new Date().toISOString() 
        } : prayer
      ));
      
      Alert.alert("Marked as Prayed");
      setActiveTab('prayed');
      
    } catch (error) {
      console.error('Error:', error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (id) => {
    try {
      // Delete from Supabase
      const { error } = await supabase
        .from('prayer_requests')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setPrayers(prayers.filter(prayer => prayer.id !== id));
    } catch (error) {
      console.error('Error deleting prayer:', error);
    }
  };

  // Filter prayers based on status boolean
  const filteredPrayers = prayers.filter(prayer => 
    activeTab === 'pending' ? !prayer.status : prayer.status
  );

  const getCategoryIcon = () => {
    return 'lock'; // Using lock icon for all private prayers
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        <Text style={styles.loadingText}>Loading private prayers...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={ADMIN_COLOR} />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Private Prayer Requests</Text>
          <Text style={styles.subtitle}>Confidential prayer needs</Text>
        </View>
      </View>

      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            Pending ({prayers.filter(p => !p.status).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'prayed' && styles.tabActive]}
          onPress={() => setActiveTab('prayed')}
        >
          <Text style={[styles.tabText, activeTab === 'prayed' && styles.tabTextActive]}>
            Prayed For ({prayers.filter(p => p.status).length})
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {filteredPrayers.length === 0 ? (
        <Animated.View 
          entering={FadeInDown.duration(500).delay(200)}
          style={styles.emptyState}
        >
          <MaterialCommunityIcons name="lock" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>
            {activeTab === 'pending' 
              ? 'No pending private prayer requests' 
              : 'No private prayers marked as prayed for yet'}
          </Text>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredPrayers}
          scrollEnabled={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInDown.duration(500).delay(100 * index)}
              style={styles.prayerCard}
            >
              <View style={styles.prayerHeader}>
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                ) : (
                  <View style={styles.anonymousAvatar}>
                    <MaterialCommunityIcons name="account" size={24} color="white" />
                  </View>
                )}
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
                <MaterialCommunityIcons 
                  name={getCategoryIcon()} 
                  size={20} 
                  color={PRIMARY_COLOR} 
                />
              </View>
              
              <Text style={styles.prayerText}>{item.request}</Text>
              
              {activeTab === 'pending' && (
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={[styles.button, styles.prayedButton]}
                    onPress={() => markAsPrayed(item.id)}
                  >
                    <MaterialCommunityIcons name="check" size={18} color="white" />
                    <Text style={styles.buttonText}>Mark as Prayed</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.button, styles.deleteButton]}
                    onPress={() => deleteRequest(item.id)}
                  >
                    <MaterialCommunityIcons name="trash-can" size={16} color="white" />
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeTab === 'prayed' && (
                <View style={styles.prayedTag}>
                  <MaterialCommunityIcons name="check" size={16} color="white" />
                  <Text style={styles.prayedTagText}>Prayed on {new Date(item.date).toLocaleDateString()}</Text>
                </View>
              )}
            </Animated.View>
          )}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30
  },
  backButton: {
    marginRight: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    color: ADMIN_COLOR,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#6c757d',
    marginBottom: 25,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 20,
  },
  tab: {
    paddingBottom: 12,
    paddingHorizontal: 16,
    marginRight: 10,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY_COLOR,
  },
  tabText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#6c757d',
  },
  tabTextActive: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: ADMIN_COLOR,
  },
  prayerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: ADMIN_COLOR,
  },
  date: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  prayerText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  prayedButton: {
    backgroundColor: '#28a745',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: 'white',
  },
  prayedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
    gap: 5,
  },
  prayedTagText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: 'white',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#adb5bd',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontFamily: 'Montserrat_400Regular',
    color: ADMIN_COLOR,
  },
  anonymousAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
  },
});