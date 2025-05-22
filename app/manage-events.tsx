import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import DateTimePicker from '@react-native-community/datetimepicker';

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function EventsScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [events, setEvents] = useState([
    {
      id: '1',
      title: "Sunday Service",
      date: new Date(2023, 10, 15, 9, 0),
      location: "Main Sanctuary",
      description: "Join us for our weekly worship service",
      category: "service"
    },
    {
      id: '2',
      title: "Bible Study",
      date: new Date(2023, 10, 17, 19, 0),
      location: "Fellowship Hall",
      description: "Midweek Bible study session",
      category: "study"
    },
    {
      id: '3',
      title: "Youth Camp",
      date: new Date(2023, 11, 5, 8, 0),
      location: "Retreat Center",
      description: "Annual youth retreat weekend",
      category: "retreat"
    },
  ]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteEvent = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            setEvents(events.filter(event => event.id !== id));
            Alert.alert("Success", "Event deleted successfully");
          }
        }
      ]
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'service': return 'church';
      case 'study': return 'book-open-variant';
      case 'retreat': return 'nature-people';
      case 'meeting': return 'account-group';
      default: return 'calendar';
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Events</Text>
            <Text style={styles.subtitle}>Manage church events and activities</Text>
          </View>
          <Link href="/admin/events/create" asChild>
            <TouchableOpacity style={styles.createButton}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6c757d" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </Animated.View>

      {filteredEvents.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.emptyState}>
          <MaterialCommunityIcons name="calendar-remove" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>
            {searchQuery ? 'No matching events found' : 'No events scheduled yet'}
          </Text>
          <Link href="/admin/events/create" asChild>
            <TouchableOpacity style={styles.createFirstButton}>
              <Text style={styles.createFirstText}>Create First Event</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredEvents}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInDown.duration(500).delay(100 * index)}
              style={styles.eventCard}
            >
              <View style={styles.eventHeader}>
                <MaterialCommunityIcons 
                  name={getCategoryIcon(item.category)} 
                  size={24} 
                  color={PRIMARY_COLOR} 
                />
                <Text style={styles.eventTitle}>{item.title}</Text>
                <View style={styles.eventActions}>
                  <Link href={`/admin/events/edit/${item.id}`} asChild>
                    <TouchableOpacity style={styles.actionButton}>
                      <MaterialCommunityIcons name="pencil" size={20} color={ADMIN_COLOR} />
                    </TouchableOpacity>
                  </Link>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => deleteEvent(item.id)}
                  >
                    <MaterialCommunityIcons name="trash-can" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="time" size={16} color="#6c757d" />
                  <Text style={styles.detailText}>{formatDate(item.date)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons name="map-marker" size={16} color="#6c757d" />
                  <Text style={styles.detailText}>{item.location}</Text>
                </View>
                {item.description && (
                  <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="text" size={16} color="#6c757d" />
                    <Text style={styles.detailText} numberOfLines={2}>{item.description}</Text>
                  </View>
                )}
              </View>
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
  createButton: {
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: ADMIN_COLOR,
    marginLeft: 12,
    flex: 1,
  },
  eventActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f3f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
    flex: 1,
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