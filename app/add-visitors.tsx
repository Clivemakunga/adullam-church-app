import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useFonts, Montserrat_600SemiBold, Montserrat_400Regular } from "@expo-google-fonts/montserrat";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { supabase } from '@/lib/supabase';  // Make sure supabase client is set up correctly
import DateTimePicker from '@react-native-community/datetimepicker';  // For Date Picker
import { Ionicons } from '@expo/vector-icons';  // For back button icon
import { router } from 'expo-router';

// Regular expression for phone number validation (basic format)
const phoneRegex = /^[0-9]{10}$/;  // Adjust the regex as needed

const PRIMARY_COLOR = '#c31c6b';
const ADMIN_COLOR = '#2f4858';

export default function AddVisitorScreen({ navigation }) {  // Added navigation prop
  const [fontsLoaded] = useFonts({
    Montserrat_600SemiBold,
    Montserrat_400Regular,
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    visit_date: new Date(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || formData.visit_date;
    setShowDatePicker(false);
    setFormData({ ...formData, visit_date: currentDate });
  };

  // Validate phone number format
  const validatePhoneNumber = (phone) => {
    return phoneRegex.test(phone);
  };

  // Check if the visitor already exists based on phone number
  const checkDuplicateVisitor = async (phone) => {
    const { data, error } = await supabase
      .from('visitors')
      .select('id')
      .eq('phone', phone)
      .single();  // Fetch a single visitor with this phone number

    if (error) {
      console.log("Error checking for duplicates:", error.message);
      return false;
    }
    
    return data !== null;  // If data is not null, a visitor already exists
  };

  const handleSubmit = async () => {
    const { name, phone, address, visit_date } = formData;

    // Validate required fields
    if (!name || !phone || !address || !visit_date) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(phone)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    // Check for duplicate visitor
    const isDuplicate = await checkDuplicateVisitor(phone);
    if (isDuplicate) {
      Alert.alert('Duplicate Visitor', 'A visitor with this phone number already exists');
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from('visitors')
      .insert([{ name, phone, address, visit_date }]);

    setIsSubmitting(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Visitor added successfully!');
      setFormData({
        name: '',
        phone: '',
        address: '',
        visit_date: new Date(),
      });
    }
  };

  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={ADMIN_COLOR} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Add New Visitor</Text>
          <Text style={styles.subtitle}>Fill in the details to register a new visitor</Text>
        </View>
      </View>

      {/* Name Input */}
      <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.formGroup}>
        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />
      </Animated.View>

      {/* Phone Input */}
      <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.formGroup}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
        />
      </Animated.View>

      {/* Address Input */}
      <Animated.View entering={FadeInDown.duration(500).delay(300)} style={styles.formGroup}>
        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter address"
          multiline
          numberOfLines={3}
          value={formData.address}
          onChangeText={(text) => setFormData({ ...formData, address: text })}
        />
      </Animated.View>

      {/* Visit Date Picker */}
      <Animated.View entering={FadeInDown.duration(500).delay(400)} style={styles.formGroup}>
        <Text style={styles.label}>Visit Date *</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={styles.dateText}>{formData.visit_date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.visit_date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </Animated.View>

      {/* Submit Button */}
      <Animated.View entering={FadeInDown.duration(500).delay(500)}>
        <TouchableOpacity 
          style={[styles.uploadButton, isSubmitting && styles.uploadButtonDisabled]} 
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.uploadButtonText}>
            {isSubmitting ? 'Submitting...' : 'Add Visitor'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
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
    marginBottom: 25,
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
    marginBottom: 0,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: ADMIN_COLOR,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: '#6c757d',
  },
  uploadButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadButtonDisabled: {
    backgroundColor: '#adb5bd',
  },
  uploadButtonText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: 'white',
  },
});