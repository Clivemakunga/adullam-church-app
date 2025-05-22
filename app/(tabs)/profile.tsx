import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: user?.photoURL || 'https://i.imgur.com/0LKZQYM.png' }} 
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user?.displayName || 'Guest User'}</Text>
          <Text style={styles.email}>{user?.email || 'No email provided'}</Text>
        </View>
      </View>

      {/* Admin Dashboard Button (only for admins) */}
      {user?.is_admin && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin</Text>
          <ProfileButton 
            icon={<MaterialCommunityIcons name="shield-account" size={24} color="#c31c6b" />}
            title="Admin Dashboard"
            onPress={() => router.push('/adminHome')}
          />
        </View>
      )}

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Account</Text>
        
        <ProfileButton 
          icon={<MaterialIcons name="person-outline" size={24} color="#c31c6b" />}
          title="Edit Profile"
          onPress={() => router.push('/edit-profile')}
        />
        
        <ProfileButton 
          icon={<MaterialIcons name="notifications-none" size={24} color="#c31c6b" />}
          title="Notification Settings"
          onPress={() => router.push('/notification-settings')}
        />
        
        <ProfileButton 
          icon={<MaterialIcons name="lock-outline" size={24} color="#c31c6b" />}
          title="Change Password"
          onPress={() => router.push('/change-password')}
        />
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <ProfileButton 
          icon={<Feather name="moon" size={24} color="#c31c6b" />}
          title="Dark Mode"
          isToggle={true}
        />
        
        <ProfileButton 
          icon={<MaterialIcons name="language" size={24} color="#c31c6b" />}
          title="Language"
          value="English"
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Profile Button Component
const ProfileButton = ({ icon, title, value, isToggle = false, onPress }) => {
  return (
    <TouchableOpacity style={styles.profileButton} onPress={onPress}>
      <View style={styles.buttonLeft}>
        {icon}
        <Text style={styles.buttonText}>{title}</Text>
      </View>
      <View style={styles.buttonRight}>
        {value && <Text style={styles.buttonValue}>{value}</Text>}
        {isToggle && <View style={styles.toggle} />}
        <MaterialIcons name="chevron-right" size={24} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 40
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#c31c6b',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  buttonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 12,
  },
  buttonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonValue: {
    fontSize: 14,
    color: '#999',
    marginRight: 8,
  },
  toggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#c31c6b',
    marginRight: 8,
    opacity: 0.3,
  },
  logoutButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});