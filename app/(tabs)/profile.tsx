import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (!authUser) {
          setLoading(false);
          return;
        }

        // Get additional user data from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (userError) throw userError;

        setUser({
          ...authUser,
          ...userData,
          is_admin: userData?.is_admin || false
        });

        setIsAdmin(userData?.is_admin || false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        fetchUserData();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#c31c6b" />
        <Text style={styles.loaderText}>Loading user data...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => router.push('/(auth)/login')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

    const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
    } else {
      router.replace('/login'); // Navigate to the welcome screen after sign-out
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: user?.photoURL || 'https://avatar.iran.liara.run/public/boy' }} 
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user?.first_name} {user?.last_name  || 'Guest User'}</Text>
          <Text style={styles.email}>{user?.email || 'No email provided'}</Text>
          {isAdmin && <Text style={styles.role}>Administrator</Text>}
        </View>
      </View>

      {/* Admin Dashboard Button (only for admins) */}
      {isAdmin && (
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
        />
        
        <ProfileButton 
          icon={<MaterialIcons name="notifications-none" size={24} color="#c31c6b" />}
          title="Notification Settings"
        />
        
        <ProfileButton 
          icon={<MaterialIcons name="lock-outline" size={24} color="#c31c6b" />}
          title="Change Password"
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
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleSignOut}
      >
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loaderText: {
    marginTop: 10,
    color: '#c31c6b',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  signInButton: {
    backgroundColor: '#c31c6b',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
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
    color: '#333',
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#c31c6b',
    fontWeight: '500',
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
    color: '#333',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20
  },
  logoutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});