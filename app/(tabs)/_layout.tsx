import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { View, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#c31c6b',
        tabBarInactiveTintColor: '#999',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 0,
        },
        tabBarStyle: {
          height: 70,
          paddingHorizontal: 20,
          paddingBottom: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          position: 'relative',
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="videos"
        options={{
          title: "Connect",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      
      {/* Center Elevated Button */}
      <Tabs.Screen
        name="sermons"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => (
            <View style={styles.centerButton}>
              <FontAwesome5
                name="bible" 
                size={32} 
                color={focused ? '#c31c6b' : '#000'} 
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="events"
        options={{
          title: "Events",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user-circle" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    position: 'absolute',
    top: -25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#fff',
  },
});