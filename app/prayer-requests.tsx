import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function PrayerRequestsScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [prayers, setPrayers] = useState([
    {
      id: 1,
      name: "Maria Garcia",
      date: "2023-06-15",
      request: "Please pray for my son who is going through depression and anxiety. He needs God's healing touch.",
      status: "pending",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      category: "healing"
    },
    {
      id: 2,
      name: "James Wilson",
      date: "2023-06-14",
      request: "Pray for my job interview next week. I really need this position to support my family.",
      status: "pending",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
      category: "employment"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      date: "2023-06-12",
      request: "My marriage is struggling. We need prayer for reconciliation and God's wisdom.",
      status: "prayed",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      category: "marriage"
    },
  ]);

  const [activeTab, setActiveTab] = useState('pending');

  const markAsPrayed = (id) => {
    setPrayers(prayers.map(prayer => 
      prayer.id === id ? {...prayer, status: "prayed"} : prayer
    ));
  };

  const deleteRequest = (id) => {
    setPrayers(prayers.filter(prayer => prayer.id !== id));
  };

  const filteredPrayers = prayers.filter(prayer => 
    activeTab === 'pending' ? prayer.status === 'pending' : prayer.status === 'prayed'
  );

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'healing':
        return 'heart-pulse';
      case 'employment':
        return 'briefcase';
      case 'marriage':
        return 'heart';
      case 'family':
        return 'home';
      case 'financial':
        return 'cash';
      default:
        return 'pray';
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(500)}>
        <Text style={styles.title}>Prayer Requests</Text>
        <Text style={styles.subtitle}>Lift up your congregation in prayer</Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
            Pending ({prayers.filter(p => p.status === 'pending').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'prayed' && styles.tabActive]}
          onPress={() => setActiveTab('prayed')}
        >
          <Text style={[styles.tabText, activeTab === 'prayed' && styles.tabTextActive]}>
            Prayed For
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {filteredPrayers.length === 0 ? (
        <Animated.View 
          entering={FadeInDown.duration(500).delay(200)}
          style={styles.emptyState}
        >
          <MaterialCommunityIcons name="pray" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>
            {activeTab === 'pending' 
              ? 'No pending prayer requests' 
              : 'No prayers marked as prayed for yet'}
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
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
                <MaterialCommunityIcons 
                  name={getCategoryIcon(item.category)} 
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
                  <Text style={styles.prayedTagText}>Prayed on {item.date}</Text>
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
});