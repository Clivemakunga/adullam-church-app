import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  Alert
} from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import { FontAwesome } from "@expo/vector-icons";
import { Dropdown } from 'react-native-element-dropdown';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

const PRIMARY_COLOR = '#6a1b9a';

const professionsList = [
  { label: 'Doctor', value: 'Doctor' },
  { label: 'Teacher', value: 'Teacher' },
  { label: 'Engineer', value: 'Engineer' },
  { label: 'Nurse', value: 'Nurse' },
  { label: 'Accountant', value: 'Accountant' },
  { label: 'Lawyer', value: 'Lawyer' },
  { label: 'Business Owner', value: 'Business Owner' },
  { label: 'IT Professional', value: 'IT Professional' },
  { label: 'Artist', value: 'Artist' },
  { label: 'Other', value: 'Other' }
];

export default function AddProfessionScreen() {
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [professionData, setProfessionData] = useState({
    name: '',
    surname: '',
    phone: '',
    email: '',
    businessName: '',
    profession: '',
    customProfession: ''
  });

  const [isProfessionOther, setIsProfessionOther] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current user session
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        
        if (currentUser) {
          setUser(currentUser);
          
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
          if (profileError) throw profileError;
          
          setProfile(profileData);
          
          // Initialize form data with user details
          setProfessionData(prev => ({
            ...prev,
            name: profileData?.first_name || '',
            surname: profileData?.last_name || '',
            email: currentUser.email || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfessionChange = (field, value) => {
    setProfessionData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'profession') {
      setIsProfessionOther(value === 'Other');
    }
  };

  const handleSubmitProfession = async () => {
    if (!professionData.name || !professionData.surname || !professionData.phone || 
        !professionData.email || !professionData.profession) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (professionData.profession === 'Other' && !professionData.customProfession) {
      Alert.alert('Error', 'Please specify your profession');
      return;
    }

    try {
      const professionToSave = professionData.profession === 'Other' 
        ? professionData.customProfession 
        : professionData.profession;

      const { error } = await supabase
        .from('professions')
        .insert([{
          user_id: user?.id,
          first_name: professionData.name,
          last_name: professionData.surname,
          phone: professionData.phone,
          email: professionData.email,
          business_name: professionData.businessName,
          profession: professionToSave
        }]);

      if (error) throw error;

      Alert.alert('Success', 'Your profession has been added successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error submitting profession:', error);
      Alert.alert('Error', 'Failed to submit profession. Please try again.');
    }
  };

  if (!fontsLoaded || loading) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Your Profession</Text>
      </View>

      <Text style={styles.inputLabel}>First Name*</Text>
      <TextInput
        style={styles.input}
        placeholder="First name"
        value={professionData.name}
        onChangeText={(text) => handleProfessionChange('name', text)}
      />

      <Text style={styles.inputLabel}>Surname*</Text>
      <TextInput
        style={styles.input}
        placeholder="Surname"
        value={professionData.surname}
        onChangeText={(text) => handleProfessionChange('surname', text)}
      />

      <Text style={styles.inputLabel}>Phone Number*</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone number"
        value={professionData.phone}
        onChangeText={(text) => handleProfessionChange('phone', text)}
        keyboardType="phone-pad"
      />

      <Text style={styles.inputLabel}>Email*</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={professionData.email}
        onChangeText={(text) => handleProfessionChange('email', text)}
        keyboardType="email-address"
        editable={!user?.email} // Make editable only if email is not available
      />

      <Text style={styles.inputLabel}>Business Name (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Business name"
        value={professionData.businessName}
        onChangeText={(text) => handleProfessionChange('businessName', text)}
      />

      <Text style={styles.inputLabel}>Profession*</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={professionsList}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select your profession"
        searchPlaceholder="Search..."
        value={professionData.profession}
        onChange={item => handleProfessionChange('profession', item.value)}
        renderLeftIcon={() => (
          <FontAwesome 
            name="briefcase" 
            size={20} 
            color={PRIMARY_COLOR} 
            style={styles.dropdownIcon}
          />
        )}
      />

      {isProfessionOther && (
        <>
          <Text style={styles.inputLabel}>Specify Your Profession*</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your profession"
            value={professionData.customProfession}
            onChangeText={(text) => handleProfessionChange('customProfession', text)}
          />
        </>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmitProfession}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    marginTop: 10
  },
  title: {
    fontSize: 24,
    fontFamily: 'Montserrat_600SemiBold',
    color: '#333',
    textAlign: 'center',
  },
  inputLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontFamily: 'Montserrat_400Regular',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: '#757575',
  },
  submitButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  submitButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: 'white',
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  placeholderStyle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
    color: '#757575',
  },
  selectedTextStyle: {
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 14,
    fontFamily: 'Montserrat_400Regular',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdownIcon: {
    marginRight: 10,
  },
});