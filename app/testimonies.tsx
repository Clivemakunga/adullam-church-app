import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function TestimoniesScreen() {
  const router = useRouter();
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [testimonies, setTestimonies] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      date: "2023-06-15",
      content: "I was healed from chronic pain after the prayer session last week. I've been suffering for 3 years and now I'm completely free!",
      status: "pending",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      name: "Michael Brown",
      date: "2023-06-14",
      content: "The financial breakthrough I experienced after joining the prosperity ministry has been incredible. My business has doubled in revenue.",
      status: "pending",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "Grace Williams",
      date: "2023-06-12",
      content: "My marriage was restored after attending the marriage counseling sessions. We were on the verge of divorce but now we're stronger than ever.",
      status: "approved",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
  ]);

  const approveTestimony = (id) => {
    setTestimonies(testimonies.map(item => 
      item.id === id ? {...item, status: "approved"} : item
    ));
  };

  const rejectTestimony = (id) => {
    setTestimonies(testimonies.filter(item => item.id !== id));
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={ADMIN_COLOR} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Manage Testimonies</Text>
          <Text style={styles.subtitle}>Review and approve congregant testimonies</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={styles.tabTextActive}>Pending ({testimonies.filter(t => t.status === "pending").length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Approved</Text>
        </TouchableOpacity>
      </View>

      {testimonies.filter(t => t.status === "pending").map((testimony, index) => (
        <Animated.View 
          key={testimony.id}
          entering={FadeInDown.duration(500).delay(100 * index)}
          style={styles.testimonyCard}
        >
          <View style={styles.testimonyHeader}>
            <Image source={{ uri: testimony.avatar }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{testimony.name}</Text>
              <Text style={styles.date}>{testimony.date}</Text>
            </View>
          </View>
          
          <Text style={styles.testimonyText}>{testimony.content}</Text>
          
          <View style={styles.actions}>
            <TouchableOpacity 
              style={[styles.button, styles.approveButton]}
              onPress={() => approveTestimony(testimony.id)}
            >
              <MaterialCommunityIcons name="check" size={18} color="white" />
              <Text style={styles.buttonText}>Approve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.rejectButton]}
              onPress={() => rejectTestimony(testimony.id)}
            >
              <MaterialCommunityIcons name="close" size={18} color="white" />
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      ))}

      {testimonies.filter(t => t.status === "pending").length === 0 && (
        <Animated.View 
          entering={FadeInDown.duration(500)}
          style={styles.emptyState}
        >
          <Ionicons name="checkmark-done" size={48} color="#adb5bd" />
          <Text style={styles.emptyText}>No pending testimonies to review</Text>
        </Animated.View>
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
    marginBottom: 20,
    marginTop: 30
  },
  backButton: {
    marginRight: 15,
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
    marginBottom: 5,
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
  testimonyHeader: {
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
  testimonyText: {
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
  approveButton: {
    backgroundColor: '#28a745',
  },
  rejectButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
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