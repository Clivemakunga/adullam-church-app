import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Image, RefreshControl } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function PrayerWallScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [prayers, setPrayers] = useState([
    {
      id: '1',
      name: "Sarah Johnson",
      date: "2023-10-15",
      request: "Please pray for my mother's healing from cancer. She's undergoing chemotherapy next week.",
      isPrivate: false,
      isApproved: true,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      category: "healing",
      prayedCount: 12
    },
    {
      id: '2',
      name: "Michael Brown",
      date: "2023-10-14",
      request: "Pray for my job interview on Friday. I really need this position to support my family.",
      isPrivate: false,
      isApproved: true,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      category: "employment",
      prayedCount: 8
    },
    {
      id: '3',
      name: "Anonymous",
      date: "2023-10-12",
      request: "Pray for my marriage restoration. We're going through difficult times.",
      isPrivate: true,
      isApproved: true,
      avatar: null,
      category: "marriage",
      prayedCount: 5
    },
    {
      id: '4',
      name: "Grace Williams",
      date: "2023-10-10",
      request: "Pray for my son who's struggling with addiction.",
      isPrivate: false,
      isApproved: false,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      category: "family",
      prayedCount: 0
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  // Filter to show only approved, non-private prayers
  const visiblePrayers = prayers.filter(prayer => 
    prayer.isApproved && !prayer.isPrivate
  );

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API refresh
    setTimeout(() => {
      setRefreshing(false);
      // In a real app, you would fetch new data here
    }, 1500);
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'healing': return 'heart-pulse';
      case 'employment': return 'briefcase';
      case 'marriage': return 'heart';
      case 'family': return 'home';
      case 'spiritual': return 'pray';
      default: return 'pray';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (!fontsLoaded) return null;

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

      {visiblePrayers.length === 0 ? (
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
          data={visiblePrayers}
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
                <MaterialCommunityIcons 
                  name={getCategoryIcon(item.category)} 
                  size={20} 
                  color={PRIMARY_COLOR} 
                />
              </View>
              
              <Text style={styles.prayerText}>{item.request}</Text>
              
              <View style={styles.prayerFooter}>
                <TouchableOpacity style={styles.prayedButton}>
                  <MaterialCommunityIcons name="hands-pray" size={18} color={PRIMARY_COLOR} />
                  <Text style={styles.prayedCountText}>Prayed {item.prayedCount} times</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.prayNowButton}>
                  <Text style={styles.prayNowText}>I Prayed For This</Text>
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
});