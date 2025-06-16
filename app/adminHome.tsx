import { Link, router } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { 
  FadeIn, 
  FadeInDown, 
  SlideInRight,
  FlipInYLeft
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather, FontAwesome } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#c31c6b';
const PRIMARY_LIGHT = 'rgba(195, 28, 107, 0.2)';
const ADMIN_COLOR = '#2f4858';

export default function AdminHomeScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  if (!fontsLoaded) return null;

  const managementSections = [
    {
      id: 1,
      title: "Add Visitors",
      icon: "account",
      count: 1,
      screen: "/add-visitors",
      description: "Do follow ups"
    },
    // {
    //   id: 2,
    //   title: "Events",
    //   icon: "calendar",
    //   count: 2,
    //   screen: "/admin/events",
    //   description: "Create & manage events"
    // },
    {
      id: 3,
      title: "Prayers",
      icon: "hands-pray",
      count: 5,
      screen: "/prayer-requests",
      description: "Pending requests"
    },
    {
      id: 4,
      title: "Content",
      icon: "file-document",
      count: 3,
      screen: "/create-sermons",
      description: "Sermons & Devotionals"
    },
    {
      id: 5,
      title: "Ministries",
      icon: "church",
      count: 4,
      screen: "/ministries",
      description: "Manage departments"
    },
    {
      id: 6,
      title: "Testimonies",
      icon: "test-tube",
      count: 7,
      screen: "/testimonies",
      description: "View & approve"
    },
    {
      id: 7,
      title: "Professions",
      icon: "briefcase",
      screen: "/professions",
      description: "Congregants' vocations"
    },
    // {
    //   id: 8,
    //   title: "Church Roles",
    //   icon: "account-group",
    //   screen: "/admin/roles",
    //   description: "Manage positions"
    // },
    {
      id: 9,
      title: "Church Departments",
      icon: "video-plus",
      screen: "/departments",
      description: "Church reels & videos"
    },
    {
      id: 10,
      title: "Create Devotions",
      icon: "book-open",
      screen: "/create-devotion",
      description: "Daily spiritual content"
    },
    {
      id: 11,
      title: "Believers Section",
      icon: "chart-bar",
      screen: "/believers",
      description: "See all the details for the new belivers"
    },
    {
      id: 12,
      title: "Visitors Section",
      icon: "cog",
      screen: "/visitors-list",
      description: "See all the details for the visitors"
    },
    {
      id: 13,
      title: "Devotions",
      icon: "cog",
      screen: "/admin-devotions",
      description: "See all the details for the visitors"
    },
  ];

  return (
    <LinearGradient
      colors={['#f8f9fa', '#e9ecef']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Admin Header with Back Button */}
        <Animated.View 
          style={styles.header}
          entering={FadeIn.duration(800)}
        >
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color={ADMIN_COLOR} />
            </TouchableOpacity>
            <View>
              <Text style={styles.adminTitle}>Admin Dashboard</Text>
              <Text style={styles.adminSubtitle}>Manage Church Resources</Text>
            </View>
          </View>
          <MaterialCommunityIcons 
            name="shield-account" 
            size={32} 
            color={ADMIN_COLOR} 
          />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          style={styles.section}
          entering={SlideInRight.duration(800).delay(200)}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/create-event')}
            >
              <Feather name="plus-circle" size={24} color="white" />
              <Text style={styles.quickActionText}>Create Event</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/add-believers')}
            >
              <MaterialCommunityIcons name="account" size={24} color="white" />
              <Text style={styles.quickActionText}>Add New Believer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/create-devotion')}
            >
              <FontAwesome5 name="book-open" size={20} color="white" />
              <Text style={styles.quickActionText}>New Devotion</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Management Grid */}
        <Animated.View 
          style={styles.section}
          entering={FlipInYLeft.duration(800)}
        >
          <View style={styles.gridContainer}>
            {managementSections.map((section, index) => (
              <Animated.View 
                key={section.id}
                entering={FadeInDown.duration(600).delay(100 * index)}
              >
                <Link href={section.screen} asChild>
                  <TouchableOpacity style={styles.managementCard}>
                    <View style={styles.cardHeader}>
                      <MaterialCommunityIcons 
                        name={section.icon} 
                        size={24} 
                        color={ADMIN_COLOR} 
                      />
                      {section.count !== undefined && (
                        <View style={styles.countBadge}>
                          <Text style={styles.countText}>{section.count}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.cardTitle}>{section.title}</Text>
                    <Text style={styles.cardDescription}>{section.description}</Text>
                  </TouchableOpacity>
                </Link>
              </Animated.View>
            ))}
          </View>
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
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  backButton: {
    marginRight: 10,
  },
  adminTitle: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    color: ADMIN_COLOR,
    marginTop: 30
  },
  adminSubtitle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#6c757d',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_600SemiBold',
    color: ADMIN_COLOR,
    marginBottom: 15,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  managementCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  countBadge: {
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: PRIMARY_COLOR,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
  },
  cardTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: ADMIN_COLOR,
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: '#6c757d',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    color: 'white',
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
  },
  approvalsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  approvalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  approvalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  approvalText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: ADMIN_COLOR,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
});