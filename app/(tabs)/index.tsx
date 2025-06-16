import { Link, router } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp, 
  ZoomIn, 
  SlideInRight, 
  FadeInRight,
  BounceIn,
  LightSpeedInLeft,
  RotateInDownLeft,
  FlipInYLeft
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Entypo } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#c31c6b';
const PRIMARY_LIGHT = 'rgba(195, 28, 107, 0.2)';

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  if (!fontsLoaded) return null;

  // Sample data
  const liveNow = true;
  const upcomingEvents = [
    { id: 1, title: "Youth Retreat", date: "Jun 15-17", icon: "campfire" },
    { id: 2, title: "Bible Workshop", date: "Jun 20", icon: "book-open-variant" },
  ];
  
  const quickActions = [
    { 
      id: 1, 
      title: "Prayer", 
      time: "3:40 AM", 
      subtext: "Requests", 
      icon: "hands-pray", 
      screen: "/prayers" 
    },
    { 
      id: 2, 
      title: "Sermons", 
      time: "15:20", 
      subtext: "Watch Now", 
      icon: "video", 
      screen: "/sermons" 
    },
    { 
      id: 3, 
      title: "Devotions", 
      time: "14:24", 
      subtext: "Daily Bread", 
      icon: "book-open", 
      screen: "/devotions" 
    },
    { 
      id: 4, 
      title: "Testimonies", 
      time: "6:45 PM", 
      subtext: "Join Us", 
      icon: "handshake", 
      screen: "/testimony-wall" 
    },
  ];

  return (
    <LinearGradient
      colors={['#f8f9fa', '#e9ecef']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header with Logo and Live Badge */}
        <Animated.View 
          style={styles.header}
          entering={BounceIn.duration(1000)}
        >
          <Image 
            source={require('../../assets/images/adullam_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          {liveNow && (
            <Animated.View 
              style={styles.liveBadge}
              entering={ZoomIn.duration(1000).springify()}
            >
              <View style={styles.livePulse} />
              <Text style={styles.liveText}>LIVE NOW</Text>
            </Animated.View>
          )}
        </Animated.View>

        {/* Welcome Message */}
        <Animated.Text 
          style={styles.welcomeText}
          entering={LightSpeedInLeft.duration(800).delay(200)}
        >
          Welcome back, Church Family!
        </Animated.Text>

        {/* Quick Actions Section */}
        <Animated.View 
          style={styles.section}
          entering={FlipInYLeft.duration(800).delay(400)}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="flash" size={22} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View 
                key={action.id}
                entering={RotateInDownLeft.duration(600).delay(150 * index)}
              >
                <Link href={action.screen} asChild>
                  <TouchableOpacity style={styles.timeCard}>
                    <Text style={styles.cardTitle}>{action.title}</Text>
                    {/* <Text style={styles.cardTime}>{action.time}</Text> */}
                    <View style={styles.cardFooter}>
                      <MaterialCommunityIcons 
                        name={action.icon} 
                        size={20} 
                        color={PRIMARY_COLOR} 
                      />
                      <Text style={styles.cardSubtext}>{action.subtext}</Text>
                    </View>
                  </TouchableOpacity>
                </Link>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Live Streaming Section */}
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.duration(800).delay(600).springify()}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="tv" size={22} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>Weekly Sermon.</Text>
          </View>
            <TouchableOpacity style={styles.liveCard}>
              <Image 
                source={require('../../assets/images/live.jpg')}
                style={styles.liveImage}
                resizeMode="cover"
              />
              <Animated.View 
                style={styles.liveOverlay}
                entering={FadeInUp.duration(500).delay(800)}
              >
                <Text style={styles.liveTitle}>Sunday Sermon title here</Text>
                <Text style={styles.liveSubtitle}>date here ...</Text>
              </Animated.View>
            </TouchableOpacity>

        </Animated.View>

        {/* Upcoming Events */}
        <Animated.View 
          style={styles.section}
          entering={SlideInRight.duration(800).delay(800)}
        >
          <View style={styles.sectionHeader}>
            <Entypo name="calendar" size={22} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <Link href="/events" style={styles.seeAll}>
              <Text style={styles.seeAllText}>See All</Text>
            </Link>
          </View>
          {upcomingEvents.map((event, index) => (
            <Animated.View
              key={event.id}
              entering={FadeInRight.duration(600).delay(200 * index)}
            >
              <TouchableOpacity style={styles.eventCard}>
                <MaterialCommunityIcons 
                  name={event.icon} 
                  size={24} 
                  color={PRIMARY_COLOR} 
                />
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDate}>{event.date}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Ministries Section */}
        <Animated.View 
          style={styles.section}
          entering={FadeInDown.duration(800).delay(1000).springify()}
        >
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="hands-helping" size={20} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>Ministries</Text>
          </View>
          <View style={styles.ministryGrid}>
              <TouchableOpacity style={styles.ministryCard}>
                <Animated.View entering={ZoomIn.duration(600).delay(1100)}>
                  <FontAwesome5 name="child" size={22} color={PRIMARY_COLOR} />
                </Animated.View>
                <Text style={styles.ministryText}>Kids</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ministryCard}>
                <Animated.View entering={ZoomIn.duration(600).delay(1200)}>
                  <Ionicons name="people" size={22} color={PRIMARY_COLOR} />
                </Animated.View>
                <Text style={styles.ministryText}>Youth</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ministryCard}>
                <Animated.View entering={ZoomIn.duration(600).delay(1300)}>
                  <MaterialCommunityIcons name="heart-plus" size={22} color={PRIMARY_COLOR} />
                </Animated.View>
                <Text style={styles.ministryText}>Counseling</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ministryCard}>
                <Animated.View entering={ZoomIn.duration(600).delay(1400)}>
                  <MaterialCommunityIcons name="handshake" size={22} color={PRIMARY_COLOR} />
                </Animated.View>
                <Text style={styles.ministryText}>Volunteer</Text>
              </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Prayer Wall Preview */}
        <Animated.View 
          style={styles.section}
          entering={FadeInUp.duration(800).delay(1500)}
        >
          <View style={styles.sectionHeader}>
            <Ionicons name="chatbubbles" size={22} color={PRIMARY_COLOR} />
            <Text style={styles.sectionTitle}>Prayer Wall</Text>
            <Link href="/create-prayer-request" style={styles.seeAll}>
              <Text style={styles.seeAllText}>View All</Text>
            </Link>
          </View>
          <Animated.View 
            style={styles.prayerPreview}
            entering={FadeInRight.duration(600).delay(1600)}
          >
            <Text style={styles.prayerText}>"Thank you for praying for my healing. I'm feeling much better!"</Text>
            <Text style={styles.prayerAuthor}>- Sister Maria</Text>
          </Animated.View>
          <Link href="/create-prayer-request" asChild>
            <TouchableOpacity style={styles.prayerButton}>
              <Text style={styles.prayerButtonText}>Post Your Prayer</Text>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
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
  logo: {
    width: 100,
    height: 100,
  },
  liveBadge: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  livePulse: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: PRIMARY_COLOR,
    opacity: 0.4,
    borderRadius: 20,
  },
  liveText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    marginLeft: 6,
  },
  welcomeText: {
    fontSize: 22,
    color: '#212529',
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 25,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    marginLeft: 10,
    color: '#212529',
  },
  seeAll: {
    marginLeft: 'auto',
  },
  seeAllText: {
    color: PRIMARY_COLOR,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeCard: {
    width: (width - 52) / 2,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#212529',
    marginBottom: 4,
  },
  cardTime: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 24,
    color: PRIMARY_COLOR,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardSubtext: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
  },
  liveCard: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  liveImage: {
    width: '100%',
    height: '100%',
  },
  liveOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  liveTitle: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
  },
  liveSubtitle: {
    color: 'white',
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  eventDetails: {
    flex: 1,
    marginLeft: 15,
  },
  eventTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: '#212529',
  },
  eventDate: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#495057',
    marginTop: 4,
  },
  ministryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  ministryCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  ministryText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: '#212529',
    marginTop: 8,
  },
  prayerPreview: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  prayerText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#212529',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  prayerAuthor: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: PRIMARY_COLOR,
    textAlign: 'right',
  },
  prayerButton: {
    backgroundColor: PRIMARY_COLOR,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  prayerButtonText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
  },
});