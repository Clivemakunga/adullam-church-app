import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, FadeOutLeft, SlideInDown, SlideOutUp } from 'react-native-reanimated';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#c31c6b';

const upcomingEvents = [
  {
    id: '1',
    title: "Youth Summer Retreat",
    date: "Aug 15-17, 2023",
    location: "Mountain Camp",
    image: "https://i.imgur.com/abc123.jpg",
    registered: "120/200"
  },
  {
    id: '2',
    title: "Leadership Conference",
    date: "Sep 5, 2023",
    location: "Main Sanctuary",
    image: "https://i.imgur.com/def456.jpg",
    registered: "45/100"
  }
];

const pastEvents = [
  {
    id: 'p1',
    title: "Easter Celebration",
    date: "Apr 9, 2023",
    location: "Church Grounds",
    image: "https://i.imgur.com/ghi789.jpg",
    photos: "24"
  },
  {
    id: 'p2',
    title: "Winter Workshop",
    date: "Dec 15, 2022",
    location: "Fellowship Hall",
    image: "https://i.imgur.com/jkl012.jpg",
    photos: "18"
  }
];

export default function EventsScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const renderEvent = ({ item, index }) => (
    <Animated.View 
      entering={FadeInRight.delay(index * 100)}
      exiting={FadeOutLeft}
      style={styles.eventCard}
    >
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventInfo}>
          <Ionicons name="calendar" size={16} color="white" />
          <Text style={styles.eventText}>{item.date}</Text>
        </View>
        <View style={styles.eventInfo}>
          <MaterialIcons name="location-on" size={16} color="white" />
          <Text style={styles.eventText}>{item.location}</Text>
        </View>
        {activeTab === 'upcoming' ? (
          <View style={styles.registrationBadge}>
            <FontAwesome name="user-plus" size={14} color="white" />
            <Text style={styles.registrationText}>{item.registered} Registered</Text>
          </View>
        ) : (
          <View style={styles.photosBadge}>
            <FontAwesome name="photo" size={14} color="white" />
            <Text style={styles.photosText}>{item.photos} Photos</Text>
          </View>
        )}
      </View>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.buttonText}>
          {activeTab === 'upcoming' ? 'Register Now' : 'View Photos'}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Animated.View 
        entering={SlideInDown.springify()}
        exiting={SlideOutUp}
        style={styles.toggleContainer}
      >
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'upcoming' && styles.activeButton]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.toggleText, activeTab === 'upcoming' && styles.activeText]}>
            Upcoming
          </Text>
          {activeTab === 'upcoming' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.toggleButton, activeTab === 'past' && styles.activeButton]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.toggleText, activeTab === 'past' && styles.activeText]}>
            Previous
          </Text>
          {activeTab === 'past' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </Animated.View>

      <FlatList
        data={activeTab === 'upcoming' ? upcomingEvents : pastEvents}
        renderItem={renderEvent}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  toggleContainer: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 55
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    overflow: 'hidden'
  },
  activeButton: {
    backgroundColor: PRIMARY_COLOR + '15',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666'
  },
  activeText: {
    color: PRIMARY_COLOR
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: PRIMARY_COLOR
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20
  },
  eventCard: {
    height: 280,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden'
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute'
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%'
  },
  eventDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  eventText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14
  },
  registrationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8
  },
  photosBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a5568',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8
  },
  registrationText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 12
  },
  photosText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 12
  },
  actionButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20
  },
  buttonText: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold'
  }
});