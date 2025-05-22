import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

const ministryData = [
  {
    id: '1',
    name: "Youth Ministry",
    leader: "Pastor David",
    memberCount: 45,
    description: "Engaging young people in spiritual growth and fellowship",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=500",
    upcomingEvent: "Youth Camp - Nov 15-17"
  },
  {
    id: '2',
    name: "Men's Fellowship",
    leader: "Bro. Michael",
    memberCount: 32,
    description: "Building godly men through discipleship and accountability",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
    upcomingEvent: "Men's Retreat - Dec 5-7"
  },
  {
    id: '3',
    name: "Women's Ministry",
    leader: "Sis. Sarah",
    memberCount: 58,
    description: "Empowering women to grow in faith and community",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
    upcomingEvent: "Women's Conference - Oct 25"
  },
  {
    id: '4',
    name: "Children's Church",
    leader: "Sis. Grace",
    memberCount: 62,
    description: "Teaching kids about Jesus in fun, age-appropriate ways",
    image: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=500",
    upcomingEvent: "Vacation Bible School - July 10-14"
  },
  {
    id: '5',
    name: "Worship Team",
    leader: "Bro. James",
    memberCount: 12,
    description: "Leading the congregation in praise and worship",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a5d4?w=500",
    upcomingEvent: "Worship Night - Every Friday"
  },
];

export default function MinistriesScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [expandedMinistry, setExpandedMinistry] = useState(null);

  const toggleExpand = (id) => {
    setExpandedMinistry(expandedMinistry === id ? null : id);
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Church Ministries</Text>
            <Text style={styles.subtitle}>Manage and organize church departments</Text>
          </View>
          <Link href="/admin/ministries/create" asChild>
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>

      {ministryData.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.emptyState}>
          <MaterialCommunityIcons name="account-group" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>No ministries created yet</Text>
          <Link href="/admin/ministries/create" asChild>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Create First Ministry</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      ) : (
        <FlatList
          data={ministryData}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInDown.duration(500).delay(100 * index)}
              style={styles.ministryCard}
            >
              <TouchableOpacity onPress={() => toggleExpand(item.id)}>
                <View style={styles.ministryHeader}>
                  <Image source={{ uri: item.image }} style={styles.ministryImage} />
                  <View style={styles.ministryInfo}>
                    <Text style={styles.ministryName}>{item.name}</Text>
                    <Text style={styles.ministryLeader}>Leader: {item.leader}</Text>
                    <Text style={styles.ministryMembers}>{item.memberCount} members</Text>
                  </View>
                  <Ionicons 
                    name={expandedMinistry === item.id ? "chevron-up" : "chevron-down"} 
                    size={24} 
                    color={ADMIN_COLOR} 
                  />
                </View>
              </TouchableOpacity>

              {expandedMinistry === item.id && (
                <View style={styles.ministryDetails}>
                  <Text style={styles.ministryDescription}>{item.description}</Text>
                  
                  <View style={styles.upcomingEvent}>
                    <MaterialCommunityIcons name="calendar-star" size={18} color={PRIMARY_COLOR} />
                    <Text style={styles.upcomingEventText}>{item.upcomingEvent}</Text>
                  </View>
                  
                  <View style={styles.ministryActions}>
                    <Link href={`/admin/ministries/members/${item.id}`} asChild>
                      <TouchableOpacity style={styles.membersButton}>
                        <MaterialCommunityIcons name="account-group" size={18} color="white" />
                        <Text style={styles.membersButtonText}>View Members</Text>
                      </TouchableOpacity>
                    </Link>
                    
                    <View style={styles.editDeleteButtons}>
                      <Link href={`/admin/ministries/edit/${item.id}`} asChild>
                        <TouchableOpacity style={styles.editButton}>
                          <MaterialCommunityIcons name="pencil" size={18} color={PRIMARY_COLOR} />
                          <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                      </Link>
                      <TouchableOpacity style={styles.deleteButton}>
                        <MaterialCommunityIcons name="trash-can" size={18} color="#dc3545" />
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  addButton: {
    backgroundColor: PRIMARY_COLOR,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ministryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ministryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  ministryImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  ministryInfo: {
    flex: 1,
  },
  ministryName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: ADMIN_COLOR,
    marginBottom: 2,
  },
  ministryLeader: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
    marginBottom: 2,
  },
  ministryMembers: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  ministryDetails: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  ministryDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 12,
  },
  upcomingEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    gap: 8,
  },
  upcomingEventText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: ADMIN_COLOR,
    flex: 1,
  },
  ministryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  membersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  membersButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: 'white',
  },
  editDeleteButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  editButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: PRIMARY_COLOR,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  deleteButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#dc3545',
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
    marginBottom: 24,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  createButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: 'white',
  },
});