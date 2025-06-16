import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function TestimonyWallScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [testimonies, setTestimonies] = useState([
    {
      id: '1',
      name: "Sarah Johnson",
      date: "2023-10-15",
      content: "After years of struggling with anxiety, I found peace through the church's counseling ministry. I'm now able to live a joyful life!",
      avatar: "https://avatar.iran.liara.run/public/boy",
      isFeatured: true
    },
    {
      id: '2',
      name: "Michael Brown",
      date: "2023-10-10",
      content: "The financial breakthrough I experienced after joining the prosperity ministry has been incredible. My business has doubled in revenue!",
      avatar: "https://avatar.iran.liara.run/public/girl",
      isFeatured: false
    },
    {
      id: '3',
      name: "Grace Williams",
      date: "2023-10-05",
      content: "My marriage was restored after attending the marriage counseling sessions. We were on the verge of divorce but now we're stronger than ever.",
      avatar: "https://avatar.iran.liara.run/public/boy",
      isFeatured: true
    },
    {
      id: '4',
      name: "David Kim",
      date: "2023-09-28",
      content: "I was healed from chronic back pain during the prayer night. The doctors can't explain it but I know it was God's touch!",
      avatar: "https://avatar.iran.liara.run/public/girl",
      isFeatured: false
    },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Updated", "Testimonies refreshed successfully");
    }, 1500);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(500)} style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={ADMIN_COLOR} />
          </TouchableOpacity>
          <View>
            <Text style={styles.title}>Testimony Wall</Text>
            <Text style={styles.subtitle}>Stories of God's faithfulness</Text>
          </View>
        </View>
      </Animated.View>

      <FlatList
        data={testimonies}
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
            style={[
              styles.testimonyCard,
              item.isFeatured && styles.featuredCard
            ]}
          >
            {item.isFeatured && (
              <View style={styles.featuredBadge}>
                <MaterialCommunityIcons name="star" size={16} color="white" />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
            
            <View style={styles.testimonyHeader}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
              </View>
              <MaterialCommunityIcons 
                name="share-variant" 
                size={24} 
                color={PRIMARY_COLOR} 
                style={styles.shareIcon}
              />
            </View>
            
            <Text style={styles.testimonyContent}>{item.content}</Text>
            
            <View style={styles.actions}>
              <TouchableOpacity style={styles.likeButton}>
                <MaterialCommunityIcons name="heart-outline" size={20} color={PRIMARY_COLOR} />
                <Text style={styles.likeCount}>24</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentButton}>
                <MaterialCommunityIcons name="comment-outline" size={20} color={ADMIN_COLOR} />
                <Text style={styles.commentText}>5 comments</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      />
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
    marginTop: 10
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
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
  adminButton: {
    backgroundColor: PRIMARY_COLOR,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  testimonyCard: {
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
  featuredCard: {
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY_COLOR,
  },
  featuredBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    zIndex: 1,
  },
  featuredText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
  },
  testimonyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: ADMIN_COLOR,
    marginBottom: 2,
  },
  date: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  shareIcon: {
    marginLeft: 10,
  },
  testimonyContent: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
    paddingTop: 12,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: ADMIN_COLOR,
    marginLeft: 6,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: ADMIN_COLOR,
    marginLeft: 6,
  },
});