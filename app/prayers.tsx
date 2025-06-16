import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { supabase } from '@/lib/supabase';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function PrayerWallScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [prayers, setPrayers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

  // Fetch user ID on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  // Fetch prayers from Supabase
  const fetchPrayers = async () => {
    try {
      setLoading(true); // Show loader when fetching starts
      
      // First query to get all public prayers
      const { data: prayerRequests, error: prayerError } = await supabase
        .from('prayer_requests')
        .select(`
          id,
          content,
          is_private,
          created_at,
          prayer_count,
          user_id
        `)
        .eq('approved', true)
        .eq('is_private', false)
        .order('created_at', { ascending: false });

      if (prayerError) throw prayerError;

      // Get all user IDs from the prayers
      const userIds = prayerRequests.map(prayer => prayer.user_id);

      // Fetch user data for all prayer authors
      const { data: users, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          image
        `)
        .in('id', userIds);

      if (userError) throw userError;

      // Create a map of user data for easy lookup
      const userMap = users.reduce((map, user) => {
        map[user.id] = user;
        return map;
      }, {});

      // Check which prayers the current user has prayed for
      let prayedRequests = [];
      if (userId) {
        const { data: prayedData, error: prayedError } = await supabase
          .from('prayers')
          .select('request_id')
          .eq('user_id', userId);

        if (prayedError) throw prayedError;
        prayedRequests = prayedData.map(p => p.request_id);
      }

      // Combine all data
      const formattedPrayers = prayerRequests.map(prayer => {
        const user = userMap[prayer.user_id];
        return {
          id: prayer.id,
          name: user?.first_name || "Anonymous",
          date: prayer.created_at,
          request: prayer.content,
          isPrivate: prayer.is_private,
          isApproved: true,
          avatar: user?.image,
          prayedCount: prayer.prayer_count || 0, // Ensure we have a number
          hasPrayed: prayedRequests.includes(prayer.id)
        };
      });

      setPrayers(formattedPrayers);
    } catch (error) {
      console.error('Error fetching prayers:', error);
      Alert.alert('Error', 'Could not load prayer requests');
    } finally {
      setLoading(false); // Hide loader when done
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchPrayers();
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPrayers();
    setRefreshing(false);
  };

const handlePray = async (prayerId) => {
  if (!userId) {
    Alert.alert('Please sign in', 'You need to be signed in to pray for requests');
    return;
  }

  try {
    // Check if already prayed
    const { data: existingPrayer, error: checkError } = await supabase
      .from('prayers')
      .select('*')
      .eq('request_id', prayerId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingPrayer) {
      Alert.alert("You've already prayed for this request");
      return;
    }

    // Increment prayer count using the PostgreSQL function
    const { error: incrementError } = await supabase
      .rpc('increment_prayer_count', { prayer_id: prayerId });

    if (incrementError) throw incrementError;

    // Record the prayer
    const { error: insertError } = await supabase
      .from('prayers')
      .insert({
        request_id: prayerId,
        user_id: userId
      });

    if (insertError) throw insertError;

    // Update local state
    setPrayers(prayers.map(prayer => 
      prayer.id === prayerId 
        ? { ...prayer, prayedCount: (prayer.prayedCount || 0) + 1, hasPrayed: true } 
        : prayer
    ));

  } catch (error) {
    console.error('Error recording prayer:', error);
    Alert.alert('Error', 'Failed to record your prayer');
  }
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
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
        <Text style={styles.loadingText}>Loading prayers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
        <View>
          <Text style={styles.title}>Prayer Wall</Text>
          <Text style={styles.subtitle}>Join us in praying for these needs</Text>
        </View>
        <Link href="/create-prayer-request" asChild>
          <TouchableOpacity style={styles.createButton}>
            <MaterialCommunityIcons name="plus" size={20} color="white" />
            <Text style={styles.createButtonText}>New Request</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>

      {prayers.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(500)} style={styles.emptyState}>
          <MaterialCommunityIcons name="pray" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>No prayer requests to display</Text>
          <Text style={styles.emptySubtext}>Be the first to share a prayer need</Text>
          <Link href="/prayers/create" asChild>
            <TouchableOpacity style={styles.createFirstButton}>
              <Text style={styles.createFirstText}>Create Prayer Request</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      ) : (
        <FlatList
          data={prayers}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[PRIMARY_COLOR]}
              tintColor={PRIMARY_COLOR}
            />
          }
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
                <View style={styles.prayerInfo}>
                  <Text style={styles.prayerName}>{item.name || "Anonymous"}</Text>
                  <Text style={styles.prayerDate}>{formatDate(item.date)}</Text>
                </View>
              </View>
              
              <Text style={styles.prayerText}>{item.request}</Text>
              
              <View style={styles.prayerFooter}>
                <TouchableOpacity style={styles.prayedButton}>
                  <MaterialCommunityIcons 
                    name="hands-pray" 
                    size={18} 
                    color={item.hasPrayed ? '#4CAF50' : PRIMARY_COLOR} 
                  />
                  <Text style={styles.prayedCountText}>
                    {item.prayedCount} {item.prayedCount === 1 ? 'prayed' : 'prayed'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.prayNowButton,
                    item.hasPrayed && styles.prayedAlreadyButton
                  ]}
                  onPress={() => handlePray(item.id)}
                  disabled={item.hasPrayed}
                >
                  <Text style={styles.prayNowText}>
                    {item.hasPrayed ? '✓ Prayed' : 'I Prayed For This'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    color: ADMIN_COLOR,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#6c757d',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  createButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: 'white',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
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
  anonymousAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#6c757d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: ADMIN_COLOR,
  },
  prayerDate: {
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
  prayerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    paddingTop: 12,
  },
  prayedButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prayedCountText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: ADMIN_COLOR,
    marginLeft: 6,
  },
  prayNowButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  prayNowText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: 'white',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: ADMIN_COLOR,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  createFirstButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createFirstText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: 'white',
  },
  prayedAlreadyButton: {
    backgroundColor: '#4CAF50',
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
  }
});